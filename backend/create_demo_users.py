"""Create demo users matching the Figma mockups: Ethan Brown, Olivia Miller, Liam Johnson."""
import sys
import os
sys.path.insert(0, os.path.dirname(__file__))

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.core.security import hash_password
from app.models.user import User
from app.core.config import settings

engine = create_engine(settings.DATABASE_URL)
Session = sessionmaker(bind=engine)
db = Session()

PASSWORD = "Bridge2024!"

users = [
    {
        "email": "ethan.brown@bridge.demo",
        "first_name": "Ethan",
        "surname": "Brown",
        "age": 24,
        "profession": "UX Designer",
        "gender": "Male",
        "primary_goal": "Land my first role in Tech",
        "interests": ["Design", "Running", "Productivity", "Self-improvement", "Books"],
        "personality": {"extroversion": 6, "openness": 8, "agreeableness": 7, "conscientiousness": 8},
        "gender_preference": ["Any"],
        "age_preference": {"min": 20, "max": 30},
        "statement": "Joining a startup to contribute to innovative projects and learn the dynamics of a fast-paced design environment.",
        "headline": "Joining a startup to contribute to innovative projects and learn the dynamics of a fast-paced design environment.",
        "location": "Melbourne",
        "country": "Australia",
        "max_distance": 15,
        "focus": "Portfolio builder",
        "commitment_level": "Fully committed",
        "deal_breakers": ["No political talk"],
        "perspective_answers": {
            "Why does this goal matter to you right now?": "Right now, I need tangible proof of my skills. A strong portfolio will help me move from learning to actually getting opportunities.",
            "What does success look like in 6 months?": "Having a polished portfolio with 3-4 real projects that I can confidently show in interviews."
        },
    },
    {
        "email": "olivia.miller@bridge.demo",
        "first_name": "Olivia",
        "surname": "Miller",
        "age": 23,
        "profession": "Frontend Developer",
        "gender": "Female",
        "primary_goal": "Build job-ready portfolio projects",
        "interests": ["Coding", "Tech", "Fitness", "Mental health", "Creativity", "Books"],
        "personality": {"extroversion": 7, "openness": 8, "agreeableness": 8, "conscientiousness": 7},
        "gender_preference": ["Any"],
        "age_preference": {"min": 20, "max": 28},
        "statement": "Aiming to build real-world projects alongside motivated people who share a passion for technology.",
        "headline": "Aiming to build real-world projects alongside motivated people who share a passion for technology.",
        "location": "Melbourne",
        "country": "Australia",
        "max_distance": 15,
        "focus": "Portfolio builder",
        "commitment_level": "Fully committed",
        "deal_breakers": ["No flakiness", "No ghosting"],
        "perspective_answers": {
            "Why does this goal matter to you right now?": "I want to prove to myself and future employers that I can ship real products, not just follow tutorials.",
            "What changed that made you take this seriously?": "I realized that applying to jobs without a portfolio was getting me nowhere. I need to show, not tell."
        },
    },
    {
        "email": "liam.johnson@bridge.demo",
        "first_name": "Liam",
        "surname": "Johnson",
        "age": 26,
        "profession": "Product Manager",
        "gender": "Male",
        "primary_goal": "Transition into a new industry",
        "interests": ["Startups", "AI", "Finance", "Productivity", "Philosophy", "Running"],
        "personality": {"extroversion": 7, "openness": 9, "agreeableness": 6, "conscientiousness": 8},
        "gender_preference": ["Any"],
        "age_preference": {"min": 22, "max": 32},
        "statement": "Transitioning from finance to tech. Looking for collaborators to build and learn together.",
        "headline": "Transitioning from finance to tech. Looking for collaborators to build and learn together.",
        "location": "Sydney",
        "country": "Australia",
        "max_distance": 20,
        "focus": "Career transition",
        "commitment_level": "Semi serious",
        "deal_breakers": ["No negativity"],
        "perspective_answers": {
            "Why does this goal matter to you right now?": "I've spent 3 years in finance and realized my passion is in building products. This transition is now or never.",
            "Who are you doing this for — yourself or others?": "Primarily myself — I want to wake up excited about my work. But also for my future team who deserves a passionate PM."
        },
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
        gender=u.get("gender", ""),
        primary_goal=u["primary_goal"],
        interests=u["interests"],
        personality=u["personality"],
        gender_preference=u["gender_preference"],
        age_preference=u["age_preference"],
        statement=u["statement"],
        headline=u.get("headline", ""),
        location=u["location"],
        country=u.get("country", ""),
        max_distance=u["max_distance"],
        focus=u.get("focus", ""),
        commitment_level=u.get("commitment_level", ""),
        deal_breakers=u.get("deal_breakers", []),
        perspective_answers=u.get("perspective_answers", {}),
    )
    db.add(user)
    created.append(u["email"])
    print(f"Created: {u['first_name']} {u['surname']} ({u['email']})")

db.commit()
db.close()

print(f"\nDone! Created {len(created)} users.")
print(f"Password for all users: {PASSWORD}")
print("\nLogin details:")
print("─" * 50)
for u in users:
    print(f"  {u['first_name']} {u['surname']}")
    print(f"  Email: {u['email']}")
    print(f"  Password: {PASSWORD}")
    print()
