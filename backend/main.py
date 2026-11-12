import uvicorn
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List
from users import create_user, get_user_info, get_user_id_sign_in

app = FastAPI()

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

@app.post("/users")
def add_user(user: CreateUser):
    userid = create_user(user.username, user.email, user.name, user.age, user.selectedInterests)
    return {"userid": userid}

@app.get("/users/{userid}")
def get_userinfo(userid: int):
    info = get_user_info(userid)
    if info is None:
        raise HTTPException(status_code=404, detail="User info not found")
    return info

class SignInUser(BaseModel):
    input: str

@app.post("/users/signin")
def signInProfile(user: SignInUser):
    userid = get_user_id_sign_in(user.input)
    if userid is None:
            raise HTTPException(status_code=401, detail="Invalid sign in info")
    return {"userid": userid}


@app.get("/")
def home():
    return {"message": "Backend is running"}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)