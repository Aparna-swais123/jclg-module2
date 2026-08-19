from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import text
from sqlalchemy.orm import Session

from .database import get_db
from .attendance import router as attendance_router
from .assignment import router as assignment_router
from .leave import router as leave_router
from .study_material import router as study_material_router
from .notification import router as notification_router

app = FastAPI(
    title="JCLG Module 2 API",
    version="1.0.0"
)

# Enable CORS for frontend communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(attendance_router)
app.include_router(assignment_router)
app.include_router(leave_router)
app.include_router(study_material_router)
app.include_router(notification_router)


@app.get("/")
def root():
    return {
        "message": "JCLG Module 2 API is running"
    }


@app.get("/health/db")
def database_health(db: Session = Depends(get_db)):
    result = db.execute(text("SELECT 1"))
    value = result.scalar()

    return {
        "database": "connected",
        "result": value
    }