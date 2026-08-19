from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import text

from .database import get_db

router = APIRouter(
    prefix="/study-materials",
    tags=["Study Materials"]
)

@router.get("/students/{student_id}")
def get_student_study_materials(
    student_id: int,
    db: Session = Depends(get_db)
):
    query = text("""
        SELECT
            m.material_id,
            m.title,
            m.description,
            s.subject_name,
            m.material_type,
            m.file_url,
            m.uploaded_date
        FROM jclg_study_material m
        JOIN jclg_student st
            ON st.section_id = m.section_id
        JOIN jclg_subject s
            ON s.subject_id = m.subject_id
        WHERE st.student_id = :student_id
          AND m.status = TRUE
        ORDER BY m.uploaded_date DESC
    """)

    result = db.execute(
        query,
        {"student_id": student_id}
    )

    materials = result.mappings().all()

    return {
        "student_id": student_id,
        "study_materials": materials
    }