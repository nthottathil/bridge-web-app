from pydantic import BaseModel, EmailStr
from typing import List, Dict, Optional
from datetime import datetime


class PersonalitySchema(BaseModel):
    extroversion: int
    openness: int
    agreeableness: int
    conscientiousness: int


class AgePreferenceSchema(BaseModel):
    min: int
    max: int


class UserCreate(BaseModel):
    email: EmailStr
    password: str
    first_name: str
    surname: str
    age: int
    profession: str
    primary_goal: str
    interests: List[str]
    personality: PersonalitySchema
    gender_preference: List[str]
    age_preference: AgePreferenceSchema
    statement: Optional[str] = None
    location: str
    max_distance: int = 5


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class VerifyEmail(BaseModel):
    email: EmailStr
    code: str


class UserResponse(BaseModel):
    id: int
    email: str
    first_name: str
    surname: str
    email_verified: bool

    class Config:
        from_attributes = True


class UserProfile(BaseModel):
    id: int
    email: str
    first_name: str
    surname: str
    age: int
    profession: str
    primary_goal: str
    interests: List[str]
    personality: Dict
    gender_preference: List[str]
    age_preference: Dict
    statement: Optional[str]
    location: str
    max_distance: int

    class Config:
        from_attributes = True


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse
