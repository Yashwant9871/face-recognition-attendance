from sqlalchemy.orm import Session
from models import User, Attendance
import json
import numpy as np

# Create User
def create_user(db: Session, name: str, face_encoding=None):
    encoding_json = None
    if face_encoding is not None:
        encoding_json = json.dumps(face_encoding.tolist())
    user = User(name=name, face_encoding=encoding_json)
    db.add(user)
    db.commit()
    db.refresh(user)
    return user

# Get all users
def get_users(db: Session):
    return db.query(User).all()

# Get single user
def get_user_by_name(db: Session, name: str):
    return db.query(User).filter(User.name == name).first()

# Mark attendance
def mark_attendance(db: Session, user_id: int):
    attendance = Attendance(user_id=user_id)
    db.add(attendance)
    db.commit()
    db.refresh(attendance)
    return attendance

# Get attendance
def get_attendance(db: Session, user_id: int = None):
    query = db.query(Attendance)
    if user_id:
        query = query.filter(Attendance.user_id == user_id)
    return query.all()
