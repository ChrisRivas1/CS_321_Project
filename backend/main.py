
import uvicorn
import sqlite3
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import List, Optional
from users import *
from ai_assistant import router as ai_assistant_router

app = FastAPI()
app.include_router(ai_assistant_router)

origins = [
    "http://localhost:5173"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class CreateUser(BaseModel):
    username: str
    email: str
    name: str
    age: int
    selectedInterests: List[str]
    password: str = Field(min_length=8)


@app.post("/users")
def add_user(user: CreateUser):
    try:
        userid = create_user(
            user.username,
            user.email,
            user.name,
            user.age,
            user.selectedInterests,
            user.password
        )
        return {"userid": userid}

    except sqlite3.IntegrityError:
        raise HTTPException(
            status_code=409,
            detail="Username or email already exists"
        )

    except ValueError as error:
        raise HTTPException(
            status_code=422,
            detail=str(error)
        )


@app.get("/users/{userid}")
def get_userinfo(userid: int):
    info = get_user_info(userid)
    if info is None:
        raise HTTPException(status_code=404, detail="User info not found")
    return info


class SignInUser(BaseModel):
    input: str
    password: str


@app.post("/users/signin")
def signInProfile(user: SignInUser):
    userid = get_user_id_sign_in(user.input, user.password)
    if userid is None:
        raise HTTPException(
            status_code=401,
            detail="Invalid username/email or password"
        )
    return {"userid": userid}


class Preferences(BaseModel):
    preferences: List[str]


@app.post("/users/{userid}/relationships")
def add_relationship_preferences(userid: int, preferences: Preferences):
    select_relationship_preferences(userid, preferences.preferences)


@app.get("/users/{userid}/relationships")
def get_relationship_preferences(userid: int):
    return {"preferences": get_user_relationship_preferences(userid)}


@app.post("/users/{userid}/languages")
def add_language_preferences(userid: int, preferences: Preferences):
    select_language_preferences(userid, preferences.preferences)


@app.get("/users/{userid}/languages")
def get_language_preferences(userid: int):
    return {"preferences": get_user_language_preferences(userid)}


class Timeslot(BaseModel):
    day: str
    period: str


class Availability(BaseModel):
    availability: List[Timeslot]


@app.post("/users/{userid}/availability")
def set_availability(userid: int, availability: Availability):
    slots = [(slot.day, slot.period) for slot in availability.availability]
    select_availability(userid, slots)


@app.get("/users/{userid}/availability")
def get_availability(userid: int):
    return {"availability": get_user_availability(userid)}


class Interests(BaseModel):
    interests: List[str]


@app.post("/users/{userid}/interests")
def set_interests(userid: int, interests: Interests):
    if len(interests.interests) == 0:
        raise HTTPException(
            status_code=400,
            detail="Atleast one interest is required"
        )
    select_interests(userid, interests.interests)


class Bio(BaseModel):
    bio: Optional[str] = None


@app.post("/users/{userid}/bio")
def set_bio(userid: int, bio: Bio):
    text = bio.bio.strip() if bio.bio else None
    if text == "":
        text = None
    if text is not None and len(text) > 300:
        raise HTTPException(
            status_code=422,
            detail="Bio must be less than 300 characters"
        )
    update_bio(userid, text)


''' User Matching Routing '''


@app.get("/users/{userid}/candidates")
def read_candidates(userid: int):
    return {"candidates": get_candidates(userid)}


class Swipe(BaseModel):
    swipeeid: int
    liked: bool


@app.post("/users/{userid}/swipes")
def post_swipe(userid: int, swipe: Swipe):
    matched = record_swipe(userid, swipe.swipeeid, swipe.liked)
    return {"matched": matched}


@app.get("/users/{userid}/matches")
def read_matches(userid: int):
    return {"matches": get_matches(userid)}


@app.get("/")
def home():
    return {"message": "Backend is running"}


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
