from pydantic import BaseModel, EmailStr
from typing import List, Dict, Optional, Any
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
    gender: Optional[str] = None
    focus: Optional[str] = None
    headline: Optional[str] = None
    commitment_level: Optional[str] = None
    deal_breakers: Optional[List[str]] = None
    perspective_answers: Optional[Dict[str, Any]] = None
    age_collab_only: Optional[bool] = False
    gender_collab_only: Optional[bool] = False
    country: Optional[str] = None


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
    gender: Optional[str] = None
    focus: Optional[str] = None
    headline: Optional[str] = None
    commitment_level: Optional[str] = None
    deal_breakers: Optional[List[str]] = None
    perspective_answers: Optional[Dict[str, Any]] = None
    profile_photo_url: Optional[str] = None
    age_collab_only: Optional[bool] = None
    gender_collab_only: Optional[bool] = None
    country: Optional[str] = None

    class Config:
        from_attributes = True


class UserProfileUpdate(BaseModel):
    first_name: Optional[str] = None
    surname: Optional[str] = None
    age: Optional[int] = None
    profession: Optional[str] = None
    primary_goal: Optional[str] = None
    interests: Optional[List[str]] = None
    personality: Optional[PersonalitySchema] = None
    gender_preference: Optional[List[str]] = None
    age_preference: Optional[AgePreferenceSchema] = None
    statement: Optional[str] = None
    location: Optional[str] = None
    max_distance: Optional[int] = None
    gender: Optional[str] = None
    focus: Optional[str] = None
    headline: Optional[str] = None
    commitment_level: Optional[str] = None
    deal_breakers: Optional[List[str]] = None
    perspective_answers: Optional[Dict[str, Any]] = None
    profile_photo_url: Optional[str] = None
    age_collab_only: Optional[bool] = None
    gender_collab_only: Optional[bool] = None
    country: Optional[str] = None


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse
