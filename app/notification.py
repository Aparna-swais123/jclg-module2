from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import text

from .database import get_db

router = APIRouter(
    prefix="/notifications",
    tags=["Notifications"]
)

@router.get("/students/{student_id}")
def get_student_notifications(
    student_id: int,
    db: Session = Depends(get_db)
):
    query = text("""
        SELECT
            n.notification_id,
            n.title,
            n.message,
            n.notification_type,
            n.channel,
            n.reference_id,
            n.is_read,
            n.sent_at,
            n.delivery_status,
            n.created_at
        FROM jclg_notification n
        JOIN jclg_student s
            ON s.user_id = n.user_id
        WHERE s.student_id = :student_id
        ORDER BY n.created_at DESC
    """)

    result = db.execute(
        query,
        {"student_id": student_id}
    )

    notifications = result.mappings().all()

    return {
        "student_id": student_id,
        "notifications": notifications
    }