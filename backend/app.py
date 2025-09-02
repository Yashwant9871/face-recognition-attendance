from fastapi import FastAPI
from database import engine, Base

app = FastAPI()

# create tables
Base.metadata.create_all(bind=engine)

@app.get("/")
def read_root():
    return {"message": "Hello World from FastAPI"}
