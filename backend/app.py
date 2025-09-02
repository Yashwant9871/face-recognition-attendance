from fastapi import FastAPI, Depends
from sqlalchemy.orm import Session
from database import engine, Base, get_db
import crud

app = FastAPI()

# Create tables
Base.metadata.create_all(bind=engine)

@app.get("/")
def read_root():
    return {"message": "Hello World from FastAPI"}

@app.post("/users/")
def create_user(name: str, db: Session = Depends(get_db)):
    return crud.create_user(db, name)

@app.get("/users/")
def list_users(db: Session = Depends(get_db)):
    return crud.get_users(db)

@app.get("/attendance/")
def list_attendance(user_id: int = None, db: Session = Depends(get_db)):
    return crud.get_attendance(db, user_id)
