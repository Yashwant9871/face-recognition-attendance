from sqlalchemy.orm import Session
from models import User, Attendance
import json
import numpy as np

def create_user(db: Session, name: str, face_encoding=None):
    encoding_json = None
    if face_encoding is not None:
        encoding_json = json.dumps(face_encoding.tolist())
    user = User(name=name, face_encoding=encoding_json)
    db.add(user)
    db.commit()
    db.refresh(user)
    return user
