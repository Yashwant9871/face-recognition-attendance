from fastapi import FastAPI, Depends, UploadFile, File
from sqlalchemy.orm import Session
from database import engine, Base, get_db
import crud
import face_utils
import shutil
import os
import uuid

app = FastAPI()

# Create tables
Base.metadata.create_all(bind=engine)

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

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

# --- NEW FACE RECOGNITION ENDPOINTS ---

@app.post("/register/")
def register_user(name: str, file: UploadFile = File(...), db: Session = Depends(get_db)):
    file_path = os.path.join(UPLOAD_DIR, f"{uuid.uuid4()}_{file.filename}")
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    encoding = face_utils.encode_face(file_path)
    if encoding is None:
        return {"error": "Face not detected"}

    user = crud.create_user(db, name, face_encoding=encoding)
    return {"message": "User registered", "user": {"id": user.id, "name": user.name}}

@app.post("/mark_attendance/")
def mark_attendance(file: UploadFile = File(...), db: Session = Depends(get_db)):
    file_path = os.path.join(UPLOAD_DIR, f"{uuid.uuid4()}_{file.filename}")
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    unknown_encoding = face_utils.encode_face(file_path)
    if unknown_encoding is None:
        return {"error": "No face detected"}

    users = crud.get_users(db)
    for user in users:
        if user.face_encoding and face_utils.compare_faces(user.face_encoding, unknown_encoding):
            attendance = crud.mark_attendance(db, user.id)
            return {"message": f"Attendance marked for {user.name}", "attendance_id": attendance.id}

    return {"error": "No match found"}
