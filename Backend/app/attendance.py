from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import text

from .database import get_db

router = APIRouter(
    prefix="/attendance",
    tags=["Attendance"]
)


@router.get("/students/{student_id}/percentage")
def get_attendance_percentage(
    student_id: int,
    db: Session = Depends(get_db)
):
    query = text("""
        SELECT
            COUNT(*) AS total_classes,
            COUNT(*) FILTER (WHERE status = 'PRESENT') AS present_classes
        FROM jclg_attendance
        WHERE student_id = :student_id
    """)

    result = db.execute(
        query,
        {"student_id": student_id}
    ).mappings().first()

    total_classes = result["total_classes"] if result else 0
    present_classes = result["present_classes"] if result else 0

    if total_classes == 0:
        percentage = 0.0
    else:
        percentage = (present_classes / total_classes) * 100

    weekly_trend = []
    try:
        weekly_query = text("""
            SELECT 
                DATE_TRUNC('week', attendance_date) AS week_start,
                COUNT(*) AS total,
                COUNT(*) FILTER (WHERE status = 'PRESENT') AS present
            FROM jclg_attendance
            WHERE student_id = :student_id
            GROUP BY week_start
            ORDER BY week_start ASC
            LIMIT 6
        """)
        weekly_rows = db.execute(weekly_query, {"student_id": student_id}).mappings().all()
        for idx, row in enumerate(weekly_rows, start=1):
            tot = row["total"]
            pres = row["present"]
            pct = round((pres / tot) * 100, 1) if tot > 0 else 0
            weekly_trend.append({
                "week": f"W{idx}",
                "percentage": pct
            })
    except Exception:
        pass

    return {
        "student_id": student_id,
        "total_classes": total_classes,
        "present_classes": present_classes,
        "attendance_percentage": round(percentage, 2),
        "weekly": weekly_trend
    }