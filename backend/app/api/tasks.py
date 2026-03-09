from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import List, Optional
from app.core.database import get_db
from app.api.user import get_current_user_from_token
from app.models.user import User
from app.models.task import GroupTask, GroupTaskCompletion
from app.models.group import GroupMember

router = APIRouter(prefix="/api/tasks", tags=["tasks"])

DEFAULT_TASKS = [
    "Share your biggest goal this year",
    "Tell the group one fun fact about yourself",
    "Share a skill you'd love to learn",
    "Recommend a book, podcast, or video",
    "Share your morning routine",
    "Describe your ideal work day",
    "Share a challenge you recently overcame",
    "Tell the group what motivates you most",
]


class TaskResponse(BaseModel):
    id: int
    title: str
    completed_by: List[dict]

    class Config:
        from_attributes = True


def seed_tasks_for_group(db: Session, group_id: int):
    """Create default tasks for a newly formed group."""
    existing = db.query(GroupTask).filter(GroupTask.group_id == group_id).count()
    if existing > 0:
        return

    for title in DEFAULT_TASKS:
        task = GroupTask(group_id=group_id, title=title)
        db.add(task)
    db.commit()


@router.get("/{group_id}")
def get_tasks(
    group_id: int,
    current_user: User = Depends(get_current_user_from_token),
    db: Session = Depends(get_db),
):
    """Get all tasks for a group with completion info."""
    membership = db.query(GroupMember).filter(
        GroupMember.group_id == group_id,
        GroupMember.user_id == current_user.id,
        GroupMember.status == "active",
    ).first()
    if not membership:
        raise HTTPException(status_code=403, detail="Not a member of this group")

    # Seed tasks if none exist
    seed_tasks_for_group(db, group_id)

    tasks = db.query(GroupTask).filter(GroupTask.group_id == group_id).all()
    result = []

    for task in tasks:
        completions = db.query(GroupTaskCompletion).filter(
            GroupTaskCompletion.task_id == task.id
        ).all()

        completed_by = []
        for c in completions:
            user = db.query(User).filter(User.id == c.user_id).first()
            if user:
                completed_by.append({
                    "user_id": user.id,
                    "first_name": user.first_name,
                })

        result.append({
            "id": task.id,
            "title": task.title,
            "completed_by": completed_by,
        })

    return result


@router.post("/{task_id}/complete")
def complete_task(
    task_id: int,
    current_user: User = Depends(get_current_user_from_token),
    db: Session = Depends(get_db),
):
    """Mark a task as completed by the current user."""
    task = db.query(GroupTask).filter(GroupTask.id == task_id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")

    # Check membership
    membership = db.query(GroupMember).filter(
        GroupMember.group_id == task.group_id,
        GroupMember.user_id == current_user.id,
        GroupMember.status == "active",
    ).first()
    if not membership:
        raise HTTPException(status_code=403, detail="Not a member of this group")

    # Check if already completed
    existing = db.query(GroupTaskCompletion).filter(
        GroupTaskCompletion.task_id == task_id,
        GroupTaskCompletion.user_id == current_user.id,
    ).first()
    if existing:
        return {"status": "already_completed"}

    completion = GroupTaskCompletion(
        task_id=task_id,
        user_id=current_user.id,
    )
    db.add(completion)
    db.commit()

    return {"status": "completed"}
