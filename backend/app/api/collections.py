"""
API endpoints for group collections: goals, polls, notes, ask-the-group.
"""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

from app.core.database import get_db
from app.core.security import decode_access_token
from app.models.user import User
from app.models.group import Group, GroupMember
from app.models.message import Message
from app.models.collection import (
    GroupGoal, PersonalGoal,
    Poll, PollOption, PollVote,
    Note,
    AskTheGroup, AskReply,
)
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

router = APIRouter(prefix="/api/collections", tags=["collections"])
security = HTTPBearer()


# ---------------------------------------------------------------------------
# Auth helper
# ---------------------------------------------------------------------------

def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db),
) -> User:
    """Get current authenticated user from JWT token."""
    token = credentials.credentials
    payload = decode_access_token(token)

    if not payload:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token",
        )

    user_id = payload.get("user_id")
    user = db.query(User).filter(User.id == user_id).first()

    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found",
        )

    return user


def _verify_membership(db: Session, user_id: int, group_id: int):
    """Raise 403 if user is not an active member of the group."""
    membership = db.query(GroupMember).filter(
        GroupMember.group_id == group_id,
        GroupMember.user_id == user_id,
        GroupMember.status == "active",
    ).first()
    if not membership:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You are not a member of this group",
        )


# ---------------------------------------------------------------------------
# Request schemas
# ---------------------------------------------------------------------------

class GoalCreate(BaseModel):
    title: str
    group_id: int


class PersonalGoalCreate(BaseModel):
    title: str


class GoalReview(BaseModel):
    review_text: Optional[str] = None
    blockers: Optional[str] = None
    help_needed: Optional[str] = None


class PollCreate(BaseModel):
    question: str
    options: List[str]
    group_id: int


class PollVoteCreate(BaseModel):
    poll_option_id: int


class NoteCreate(BaseModel):
    title: str
    content: Optional[str] = None
    reminder_date: Optional[datetime] = None
    repeat: Optional[str] = None
    add_to_calendar: bool = False
    group_id: int


class AskCreate(BaseModel):
    question: str
    group_id: int


class AskReplyCreate(BaseModel):
    reply_text: str


# ===========================================================================
# GOALS
# ===========================================================================

@router.post("/goals", response_model=dict)
def create_group_goal(
    body: GoalCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Create a group goal and post a message to the chat."""
    _verify_membership(db, current_user.id, body.group_id)

    goal = GroupGoal(
        group_id=body.group_id,
        created_by=current_user.id,
        title=body.title,
    )
    db.add(goal)
    db.flush()

    msg = Message(
        group_id=body.group_id,
        user_id=current_user.id,
        message_text=f"New group goal: {body.title}",
        message_type="goal",
        metadata_json={"content_id": goal.id},
    )
    db.add(msg)
    db.commit()
    db.refresh(goal)

    return {
        "message": "Goal created",
        "goal_id": goal.id,
    }


@router.get("/goals/{group_id}", response_model=list)
def get_group_goals(
    group_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Get all goals for a group with personal goals."""
    _verify_membership(db, current_user.id, group_id)

    goals = (
        db.query(GroupGoal)
        .filter(GroupGoal.group_id == group_id)
        .order_by(GroupGoal.created_at.desc())
        .all()
    )

    result = []
    for g in goals:
        personal = []
        for pg in g.personal_goals:
            personal.append({
                "id": pg.id,
                "user_id": pg.user_id,
                "user_name": pg.user.first_name if pg.user else None,
                "title": pg.title,
                "completed": pg.completed,
                "review_text": pg.review_text,
                "blockers": pg.blockers,
                "help_needed": pg.help_needed,
                "created_at": str(pg.created_at) if pg.created_at else None,
            })
        result.append({
            "id": g.id,
            "group_id": g.group_id,
            "created_by": g.created_by,
            "creator_name": g.creator.first_name if g.creator else None,
            "title": g.title,
            "week_number": g.week_number,
            "is_active": g.is_active,
            "created_at": str(g.created_at) if g.created_at else None,
            "personal_goals": personal,
        })

    return result


@router.post("/goals/{goal_id}/personal", response_model=dict)
def add_personal_goal(
    goal_id: int,
    body: PersonalGoalCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Add a personal goal under a group goal."""
    goal = db.query(GroupGoal).filter(GroupGoal.id == goal_id).first()
    if not goal:
        raise HTTPException(status_code=404, detail="Group goal not found")

    _verify_membership(db, current_user.id, goal.group_id)

    personal = PersonalGoal(
        group_goal_id=goal_id,
        user_id=current_user.id,
        title=body.title,
    )
    db.add(personal)
    db.commit()
    db.refresh(personal)

    return {
        "message": "Personal goal added",
        "personal_goal_id": personal.id,
    }


@router.post("/goals/{goal_id}/review", response_model=dict)
def submit_goal_review(
    goal_id: int,
    body: GoalReview,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Submit a review for the current user's personal goal."""
    goal = db.query(GroupGoal).filter(GroupGoal.id == goal_id).first()
    if not goal:
        raise HTTPException(status_code=404, detail="Group goal not found")

    _verify_membership(db, current_user.id, goal.group_id)

    personal = (
        db.query(PersonalGoal)
        .filter(
            PersonalGoal.group_goal_id == goal_id,
            PersonalGoal.user_id == current_user.id,
        )
        .first()
    )
    if not personal:
        raise HTTPException(
            status_code=404,
            detail="You have no personal goal for this group goal",
        )

    personal.review_text = body.review_text
    personal.blockers = body.blockers
    personal.help_needed = body.help_needed
    db.commit()

    return {"message": "Review submitted"}


# ===========================================================================
# POLLS
# ===========================================================================

@router.post("/polls", response_model=dict)
def create_poll(
    body: PollCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Create a poll with options and post a message to the chat."""
    _verify_membership(db, current_user.id, body.group_id)

    if len(body.options) < 2:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="A poll needs at least 2 options",
        )

    poll = Poll(
        group_id=body.group_id,
        created_by=current_user.id,
        question=body.question,
    )
    db.add(poll)
    db.flush()

    for text in body.options:
        option = PollOption(
            poll_id=poll.id,
            text=text,
            created_by=current_user.id,
        )
        db.add(option)

    msg = Message(
        group_id=body.group_id,
        user_id=current_user.id,
        message_text=f"New poll: {body.question}",
        message_type="poll",
        metadata_json={"content_id": poll.id},
    )
    db.add(msg)
    db.commit()
    db.refresh(poll)

    return {
        "message": "Poll created",
        "poll_id": poll.id,
    }


@router.get("/polls/{group_id}", response_model=list)
def get_group_polls(
    group_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Get all polls for a group with vote counts."""
    _verify_membership(db, current_user.id, group_id)

    polls = (
        db.query(Poll)
        .filter(Poll.group_id == group_id)
        .order_by(Poll.created_at.desc())
        .all()
    )

    result = []
    for p in polls:
        options = []
        for o in p.options:
            vote_count = len(o.votes) if o.votes else 0
            user_voted = any(v.user_id == current_user.id for v in o.votes)
            options.append({
                "id": o.id,
                "text": o.text,
                "vote_count": vote_count,
                "user_voted": user_voted,
            })
        result.append({
            "id": p.id,
            "group_id": p.group_id,
            "created_by": p.created_by,
            "creator_name": p.creator.first_name if p.creator else None,
            "question": p.question,
            "is_active": p.is_active,
            "created_at": str(p.created_at) if p.created_at else None,
            "options": options,
        })

    return result


@router.post("/polls/{poll_id}/vote", response_model=dict)
def vote_on_poll(
    poll_id: int,
    body: PollVoteCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Cast a vote on a poll option."""
    poll = db.query(Poll).filter(Poll.id == poll_id).first()
    if not poll:
        raise HTTPException(status_code=404, detail="Poll not found")

    _verify_membership(db, current_user.id, poll.group_id)

    if not poll.is_active:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="This poll has ended",
        )

    # Verify option belongs to this poll
    option = db.query(PollOption).filter(
        PollOption.id == body.poll_option_id,
        PollOption.poll_id == poll_id,
    ).first()
    if not option:
        raise HTTPException(status_code=404, detail="Poll option not found")

    # Check if user already voted on this poll
    existing_vote = (
        db.query(PollVote)
        .join(PollOption)
        .filter(
            PollOption.poll_id == poll_id,
            PollVote.user_id == current_user.id,
        )
        .first()
    )
    if existing_vote:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="You have already voted on this poll",
        )

    vote = PollVote(
        poll_option_id=body.poll_option_id,
        user_id=current_user.id,
    )
    db.add(vote)
    db.commit()

    return {"message": "Vote recorded"}


@router.post("/polls/{poll_id}/end", response_model=dict)
def end_poll(
    poll_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """End voting on a poll (creator only)."""
    poll = db.query(Poll).filter(Poll.id == poll_id).first()
    if not poll:
        raise HTTPException(status_code=404, detail="Poll not found")

    if poll.created_by != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only the poll creator can end voting",
        )

    poll.is_active = False
    db.commit()

    return {"message": "Poll ended"}


# ===========================================================================
# NOTES
# ===========================================================================

@router.post("/notes", response_model=dict)
def create_note(
    body: NoteCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Create a note and post a message to the chat."""
    _verify_membership(db, current_user.id, body.group_id)

    note = Note(
        group_id=body.group_id,
        created_by=current_user.id,
        title=body.title,
        content=body.content,
        reminder_date=body.reminder_date,
        repeat=body.repeat,
        add_to_calendar=body.add_to_calendar,
    )
    db.add(note)
    db.flush()

    msg = Message(
        group_id=body.group_id,
        user_id=current_user.id,
        message_text=f"New note: {body.title}",
        message_type="note",
        metadata_json={"content_id": note.id},
    )
    db.add(msg)
    db.commit()
    db.refresh(note)

    return {
        "message": "Note created",
        "note_id": note.id,
    }


@router.get("/notes/{group_id}", response_model=list)
def get_group_notes(
    group_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Get all notes for a group."""
    _verify_membership(db, current_user.id, group_id)

    notes = (
        db.query(Note)
        .filter(Note.group_id == group_id)
        .order_by(Note.created_at.desc())
        .all()
    )

    return [
        {
            "id": n.id,
            "group_id": n.group_id,
            "created_by": n.created_by,
            "creator_name": n.creator.first_name if n.creator else None,
            "title": n.title,
            "content": n.content,
            "reminder_date": str(n.reminder_date) if n.reminder_date else None,
            "repeat": n.repeat,
            "add_to_calendar": n.add_to_calendar,
            "created_at": str(n.created_at) if n.created_at else None,
        }
        for n in notes
    ]


# ===========================================================================
# ASK THE GROUP
# ===========================================================================

@router.post("/asks", response_model=dict)
def create_ask(
    body: AskCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Create an ask-the-group question and post a message to the chat."""
    _verify_membership(db, current_user.id, body.group_id)

    ask = AskTheGroup(
        group_id=body.group_id,
        created_by=current_user.id,
        question=body.question,
    )
    db.add(ask)
    db.flush()

    msg = Message(
        group_id=body.group_id,
        user_id=current_user.id,
        message_text=f"Question for the group: {body.question}",
        message_type="ask",
        metadata_json={"content_id": ask.id},
    )
    db.add(msg)
    db.commit()
    db.refresh(ask)

    return {
        "message": "Question posted",
        "ask_id": ask.id,
    }


@router.get("/asks/{group_id}", response_model=list)
def get_group_asks(
    group_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Get all ask-the-group questions with replies."""
    _verify_membership(db, current_user.id, group_id)

    asks = (
        db.query(AskTheGroup)
        .filter(AskTheGroup.group_id == group_id)
        .order_by(AskTheGroup.created_at.desc())
        .all()
    )

    result = []
    for a in asks:
        replies = [
            {
                "id": r.id,
                "user_id": r.user_id,
                "user_name": r.user.first_name if r.user else None,
                "reply_text": r.reply_text,
                "created_at": str(r.created_at) if r.created_at else None,
            }
            for r in a.replies
        ]
        result.append({
            "id": a.id,
            "group_id": a.group_id,
            "created_by": a.created_by,
            "creator_name": a.creator.first_name if a.creator else None,
            "question": a.question,
            "created_at": str(a.created_at) if a.created_at else None,
            "replies": replies,
        })

    return result


@router.post("/asks/{ask_id}/reply", response_model=dict)
def reply_to_ask(
    ask_id: int,
    body: AskReplyCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Reply to an ask-the-group question."""
    ask = db.query(AskTheGroup).filter(AskTheGroup.id == ask_id).first()
    if not ask:
        raise HTTPException(status_code=404, detail="Question not found")

    _verify_membership(db, current_user.id, ask.group_id)

    reply = AskReply(
        ask_id=ask_id,
        user_id=current_user.id,
        reply_text=body.reply_text,
    )
    db.add(reply)
    db.commit()
    db.refresh(reply)

    return {
        "message": "Reply posted",
        "reply_id": reply.id,
    }
