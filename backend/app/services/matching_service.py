"""
Matching service for calculating compatibility scores between users.

Scoring System (0-100 points):
- Interest Overlap: 0-30 points
- Personality Compatibility: 0-40 points (Big Five traits)
- Goal Alignment: 0-30 points

Minimum threshold: 50/100 to show as a match
"""
from typing import List, Dict, Any, Optional
from sqlalchemy.orm import Session
from app.models.user import User
from app.models.group import GroupMember
from app.models.match import MatchRequest


def calculate_interest_score(user_interests: List[str], other_interests: List[str]) -> float:
    """
    Calculate interest overlap score (0-30 points).

    Args:
        user_interests: List of user's interests
        other_interests: List of potential match's interests

    Returns:
        Score from 0-30 based on shared interests
    """
    if not user_interests or not other_interests:
        return 0.0

    # Calculate Jaccard similarity (intersection / union)
    user_set = set(user_interests)
    other_set = set(other_interests)

    intersection = len(user_set & other_set)
    union = len(user_set | other_set)

    if union == 0:
        return 0.0

    similarity = intersection / union
    return similarity * 30.0


def calculate_personality_score(user_personality: Dict[str, int], other_personality: Dict[str, int]) -> float:
    """
    Calculate personality compatibility score (0-40 points).

    Uses Big Five personality traits:
    - extroversion: Higher scores = more social
    - openness: Higher scores = more creative/open to new experiences
    - agreeableness: Higher scores = more cooperative
    - conscientiousness: Higher scores = more organized

    Compatible personalities have similar trait levels.

    Args:
        user_personality: User's personality scores (1-10 for each trait)
        other_personality: Other user's personality scores

    Returns:
        Score from 0-40 based on personality similarity
    """
    traits = ['extroversion', 'openness', 'agreeableness', 'conscientiousness']

    total_difference = 0.0
    trait_count = 0

    for trait in traits:
        if trait in user_personality and trait in other_personality:
            # Calculate absolute difference (0-9 scale difference)
            difference = abs(user_personality[trait] - other_personality[trait])
            # Normalize to 0-1 (9 is max difference)
            normalized_diff = difference / 9.0
            total_difference += normalized_diff
            trait_count += 1

    if trait_count == 0:
        return 0.0

    # Average difference (0-1), then invert so lower difference = higher score
    avg_difference = total_difference / trait_count
    similarity = 1.0 - avg_difference

    return similarity * 40.0


def calculate_goal_score(user_goal: str, other_goal: str) -> float:
    """
    Calculate goal alignment score (0-30 points).

    Full points if goals match exactly, partial points for compatible goals.

    Args:
        user_goal: User's primary goal
        other_goal: Other user's primary goal

    Returns:
        Score from 0-30 based on goal alignment
    """
    if user_goal == other_goal:
        return 30.0

    # Define compatible goal pairs (partial credit)
    compatible_goals = {
        'networking': ['professional_development', 'mentorship'],
        'professional_development': ['networking', 'mentorship'],
        'mentorship': ['professional_development', 'networking'],
        'friendship': ['socialising', 'hobbies'],
        'socialising': ['friendship', 'hobbies'],
        'hobbies': ['friendship', 'socialising'],
    }

    if user_goal in compatible_goals and other_goal in compatible_goals[user_goal]:
        return 15.0

    return 0.0


def calculate_compatibility_score(user: User, other_user: User) -> int:
    """
    Calculate overall compatibility score between two users.

    Args:
        user: The current user
        other_user: Potential match

    Returns:
        Total compatibility score (0-100)
    """
    # Interest overlap (0-30 points)
    interest_score = calculate_interest_score(user.interests, other_user.interests)

    # Personality compatibility (0-40 points)
    personality_score = calculate_personality_score(user.personality, other_user.personality)

    # Goal alignment (0-30 points)
    goal_score = calculate_goal_score(user.primary_goal, other_user.primary_goal)

    total_score = interest_score + personality_score + goal_score

    return int(round(total_score))


def is_user_in_active_group(db: Session, user_id: int) -> bool:
    """
    Check if user is currently in an active group.

    Args:
        db: Database session
        user_id: User ID to check

    Returns:
        True if user is in an active group, False otherwise
    """
    active_membership = db.query(GroupMember).filter(
        GroupMember.user_id == user_id,
        GroupMember.status == "active"
    ).first()

    return active_membership is not None


def get_existing_match_request(db: Session, from_user_id: int, to_user_id: int) -> Optional[MatchRequest]:
    """
    Check if there's already a match request between two users.

    Args:
        db: Database session
        from_user_id: Sender user ID
        to_user_id: Receiver user ID

    Returns:
        MatchRequest if exists, None otherwise
    """
    # Check both directions (either user could have sent the request)
    request = db.query(MatchRequest).filter(
        (
            (MatchRequest.from_user_id == from_user_id) &
            (MatchRequest.to_user_id == to_user_id)
        ) | (
            (MatchRequest.from_user_id == to_user_id) &
            (MatchRequest.to_user_id == from_user_id)
        ),
        MatchRequest.status == "pending"
    ).first()

    return request


def matches_preferences(user: User, other_user: User) -> bool:
    """
    Check if other_user matches the user's preferences.

    Checks:
    - Age range preference
    - Gender preference (if specified)

    Args:
        user: The user with preferences
        other_user: Potential match to check

    Returns:
        True if other_user matches preferences, False otherwise
    """
    # Check age preference
    age_pref = user.age_preference
    if age_pref:
        min_age = age_pref.get('min', 18)
        max_age = age_pref.get('max', 100)

        if not (min_age <= other_user.age <= max_age):
            return False

    # Check gender preference (if user has specified one)
    gender_pref = user.gender_preference
    if gender_pref and 'any' not in gender_pref:
        # Note: We don't have gender field in User model currently
        # This is a placeholder for future implementation
        # For now, we'll assume gender preference is always satisfied
        pass

    return True


def find_potential_matches(db: Session, user: User, limit: int = 20) -> List[Dict[str, Any]]:
    """
    Find potential matches for a user based on compatibility score.

    Filters out:
    - The user themselves
    - Users already in groups
    - Users who don't match preferences
    - Users with compatibility score < 50

    Args:
        db: Database session
        user: User to find matches for
        limit: Maximum number of matches to return

    Returns:
        List of match dictionaries with user info and compatibility score
    """
    # Get all verified users except the current user
    all_users = db.query(User).filter(
        User.id != user.id,
        User.email_verified == True
    ).all()

    potential_matches = []

    for other_user in all_users:
        # Skip users already in groups
        if is_user_in_active_group(db, other_user.id):
            continue

        # Skip if there's already a pending match request
        if get_existing_match_request(db, user.id, other_user.id):
            continue

        # Check if user matches preferences
        if not matches_preferences(user, other_user):
            continue

        # Calculate compatibility score
        compatibility = calculate_compatibility_score(user, other_user)

        # Only include matches with score >= 50
        if compatibility >= 50:
            potential_matches.append({
                'user_id': other_user.id,
                'first_name': other_user.first_name,
                'age': other_user.age,
                'profession': other_user.profession,
                'statement': other_user.statement,
                'interests': other_user.interests,
                'compatibility_score': compatibility,
                'location': other_user.location,
                'primary_goal': other_user.primary_goal
            })

    # Sort by compatibility score (highest first)
    potential_matches.sort(key=lambda x: x['compatibility_score'], reverse=True)

    # Return top matches
    return potential_matches[:limit]
