from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import text

from .database import get_db

router = APIRouter(
    prefix="/assignments",
    tags=["Assignments"]
)


@router.get("/students/{student_id}")
def get_student_assignments(
    student_id: int,
    db: Session = Depends(get_db)
):
    query = text("""
        SELECT
            a.assignment_id,
            a.title,
            a.description,
            s.subject_name,
            a.assigned_date AS posted_date,
            a.due_date,
            a.status
        FROM jclg_assignment a
        JOIN jclg_student st
            ON st.section_id = a.section_id
        JOIN jclg_subject s
            ON s.subject_id = a.subject_id
        WHERE st.student_id = :student_id
          AND a.status = 'PUBLISHED'
        ORDER BY a.due_date
    """)

    result = db.execute(
        query,
        {"student_id": student_id}
    )

    assignments = result.mappings().all()

    return {
        "student_id": student_id,
        "assignments": assignments
    }