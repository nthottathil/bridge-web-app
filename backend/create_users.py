"""Create 10 new demo users for Bridge app."""
import sys
import os
sys.path.insert(0, os.path.dirname(__file__))

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.core.security import hash_password
from app.models.user import User
from app.core.config import settings
import json

engine = create_engine(settings.DATABASE_URL)
Session = sessionmaker(bind=engine)
db = Session()

PASSWORD = "Bridge2024!"

users = [
    {
        "email": "james.chen@bridge.demo",
        "first_name": "James",
        "surname": "Chen",
        "age": 28,
        "profession": "Software Engineer",
        "primary_goal": "Professional networking",
        "interests": ["Programming", "AI/ML", "Gaming", "Startups", "Cycling", "Music"],
        "personality": {"extroversion": 5, "openness": 8, "agreeableness": 7, "conscientiousness": 9},
        "gender_preference": ["Female"],
        "age_preference": {"min": 23, "max": 32},
        "statement": "Building cool stuff at a startup by day, gaming by night. Looking to connect with fellow tech enthusiasts.",
        "location": "London",
        "max_distance": 10,
    },
    {
        "email": "sofia.martinez@bridge.demo",
        "first_name": "Sofia",
        "surname": "Martinez",
        "age": 25,
        "profession": "Graphic Designer",
        "primary_goal": "Creative collaboration",
        "interests": ["Art", "Photography", "Music", "Travel", "Fashion", "Film"],
        "personality": {"extroversion": 7, "openness": 9, "agreeableness": 8, "conscientiousness": 6},
        "gender_preference": ["Any"],
        "age_preference": {"min": 22, "max": 35},
        "statement": "Creative soul who loves turning ideas into visual stories. Always looking for collaborators and inspiration.",
        "location": "London",
        "max_distance": 15,
    },
    {
        "email": "marcus.johnson@bridge.demo",
        "first_name": "Marcus",
        "surname": "Johnson",
        "age": 31,
        "profession": "Personal Trainer",
        "primary_goal": "Activity partners",
        "interests": ["Gym", "Running", "Hiking", "Cooking", "Yoga", "Swimming"],
        "personality": {"extroversion": 9, "openness": 7, "agreeableness": 8, "conscientiousness": 8},
        "gender_preference": ["Any"],
        "age_preference": {"min": 20, "max": 40},
        "statement": "Fitness is my passion but I'm also a secret foodie. Looking for workout buddies and adventure partners.",
        "location": "London",
        "max_distance": 10,
    },
    {
        "email": "priya.patel@bridge.demo",
        "first_name": "Priya",
        "surname": "Patel",
        "age": 26,
        "profession": "Medical Student",
        "primary_goal": "Find a study group",
        "interests": ["Reading", "Meditation", "Volunteering", "Music", "Cooking", "Languages"],
        "personality": {"extroversion": 4, "openness": 7, "agreeableness": 9, "conscientiousness": 10},
        "gender_preference": ["Female", "Non-binary"],
        "age_preference": {"min": 22, "max": 30},
        "statement": "Future doctor trying to survive med school. Need study buddies who understand the grind!",
        "location": "London",
        "max_distance": 5,
    },
    {
        "email": "oliver.wright@bridge.demo",
        "first_name": "Oliver",
        "surname": "Wright",
        "age": 34,
        "profession": "Architect",
        "primary_goal": "Make new friends",
        "interests": ["Art", "Photography", "Travel", "Cycling", "Museums", "Theatre"],
        "personality": {"extroversion": 6, "openness": 8, "agreeableness": 7, "conscientiousness": 8},
        "gender_preference": ["Any"],
        "age_preference": {"min": 25, "max": 40},
        "statement": "Recently moved to the city and looking to build a new social circle. Love exploring architecture and culture.",
        "location": "London",
        "max_distance": 15,
    },
    {
        "email": "emma.oconnor@bridge.demo",
        "first_name": "Emma",
        "surname": "O'Connor",
        "age": 23,
        "profession": "Marketing Coordinator",
        "primary_goal": "Dating",
        "interests": ["Travel", "Food", "Film", "Dance", "Music", "Fashion"],
        "personality": {"extroversion": 8, "openness": 8, "agreeableness": 6, "conscientiousness": 5},
        "gender_preference": ["Male"],
        "age_preference": {"min": 23, "max": 33},
        "statement": "Life's too short for boring dates. Let's grab street food and talk about our favorite films.",
        "location": "London",
        "max_distance": 10,
    },
    {
        "email": "raj.kumar@bridge.demo",
        "first_name": "Raj",
        "surname": "Kumar",
        "age": 29,
        "profession": "Data Scientist",
        "primary_goal": "Mentorship",
        "interests": ["AI/ML", "Programming", "Startups", "Reading", "Crypto", "Networking"],
        "personality": {"extroversion": 5, "openness": 9, "agreeableness": 7, "conscientiousness": 9},
        "gender_preference": ["Any"],
        "age_preference": {"min": 20, "max": 45},
        "statement": "Passionate about data and AI. Happy to mentor juniors or learn from seniors. Let's grow together.",
        "location": "London",
        "max_distance": 20,
    },
    {
        "email": "lily.thompson@bridge.demo",
        "first_name": "Lily",
        "surname": "Thompson",
        "age": 27,
        "profession": "Freelance Writer",
        "primary_goal": "Make new friends",
        "interests": ["Writing", "Reading", "Book clubs", "Gardening", "Cooking", "Meditation"],
        "personality": {"extroversion": 3, "openness": 9, "agreeableness": 8, "conscientiousness": 6},
        "gender_preference": ["Any"],
        "age_preference": {"min": 22, "max": 35},
        "statement": "Introvert who loves deep conversations over coffee. Writer by trade, reader by obsession.",
        "location": "London",
        "max_distance": 8,
    },
    {
        "email": "alex.nguyen@bridge.demo",
        "first_name": "Alex",
        "surname": "Nguyen",
        "age": 24,
        "profession": "Music Producer",
        "primary_goal": "Creative collaboration",
        "interests": ["Music", "Gaming", "VR/AR", "Film", "Dance", "Photography"],
        "personality": {"extroversion": 6, "openness": 10, "agreeableness": 6, "conscientiousness": 5},
        "gender_preference": ["Any"],
        "age_preference": {"min": 20, "max": 32},
        "statement": "Making beats and breaking boundaries. Looking for musicians, artists, and creative weirdos to collab with.",
        "location": "London",
        "max_distance": 12,
    },
    {
        "email": "zara.ahmed@bridge.demo",
        "first_name": "Zara",
        "surname": "Ahmed",
        "age": 30,
        "profession": "Human Rights Lawyer",
        "primary_goal": "Support group",
        "interests": ["Volunteering", "Politics", "Reading", "Languages", "Travel", "Yoga"],
        "personality": {"extroversion": 7, "openness": 8, "agreeableness": 9, "conscientiousness": 9},
        "gender_preference": ["Female", "Non-binary"],
        "age_preference": {"min": 25, "max": 40},
        "statement": "Fighting for justice by day, unwinding with yoga and a good book by night. Looking for like-minded people.",
        "location": "London",
        "max_distance": 10,
    },
]

created = []
for u in users:
    existing = db.query(User).filter(User.email == u["email"]).first()
    if existing:
        print(f"Skipping {u['email']} - already exists")
        continue

    user = User(
        email=u["email"],
        password_hash=hash_password(PASSWORD),
        email_verified=True,
        first_name=u["first_name"],
        surname=u["surname"],
        age=u["age"],
        profession=u["profession"],
        primary_goal=u["primary_goal"],
        interests=u["interests"],
        personality=u["personality"],
        gender_preference=u["gender_preference"],
        age_preference=u["age_preference"],
        statement=u["statement"],
        location=u["location"],
        max_distance=u["max_distance"],
    )
    db.add(user)
    created.append(u["email"])
    print(f"Created: {u['first_name']} {u['surname']} ({u['email']})")

db.commit()
db.close()

print(f"\nDone! Created {len(created)} users.")
print(f"Password for all new users: {PASSWORD}")
