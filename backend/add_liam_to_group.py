"""Add Liam to Olivia's group."""
import sys
import os
sys.path.insert(0, os.path.dirname(__file__))

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.models.user import User
from app.models.group import Group, GroupMember
from app.models.match import MatchRequest
from app.core.config import settings

engine = create_engine(settings.DATABASE_URL)
Session = sessionmaker(bind=engine)
db = Session()

# Find users
olivia = db.query(User).filter(User.first_name == "Olivia").first()
liam = db.query(User).filter(User.first_name == "Liam").first()

if not olivia:
    print("Olivia not found!")
    sys.exit(1)
if not liam:
    print("Liam not found!")
    sys.exit(1)

print(f"Found Olivia (id={olivia.id}) and Liam (id={liam.id})")

# Find Olivia's active group
olivia_membership = (
    db.query(GroupMember)
    .filter(GroupMember.user_id == olivia.id, GroupMember.status == "active")
    .first()
)

if not olivia_membership:
    print("Olivia is not in any active group! Creating a new group...")
    group = Group(name=None)
    db.add(group)
    db.flush()
    # Add Olivia
    db.add(GroupMember(group_id=group.id, user_id=olivia.id, status="active"))
    group_id = group.id
else:
    group_id = olivia_membership.group_id
    print(f"Olivia is in group {group_id}")

# Check if Liam is already in this group
liam_membership = (
    db.query(GroupMember)
    .filter(GroupMember.user_id == liam.id, GroupMember.group_id == group_id, GroupMember.status == "active")
    .first()
)

if liam_membership:
    print("Liam is already in this group!")
else:
    # Create accepted match request
    match = MatchRequest(
        from_user_id=olivia.id,
        to_user_id=liam.id,
        status="accepted",
    )
    db.add(match)

    # Add Liam to the group
    db.add(GroupMember(group_id=group_id, user_id=liam.id, status="active"))
    db.commit()
    print(f"Liam has been added to group {group_id}!")

# Show all members
members = (
    db.query(GroupMember)
    .filter(GroupMember.group_id == group_id, GroupMember.status == "active")
    .all()
)
print(f"\nGroup {group_id} members:")
for m in members:
    user = db.query(User).filter(User.id == m.user_id).first()
    print(f"  - {user.first_name} {user.surname} (id={user.id})")

db.close()
