from fastapi import APIRouter, HTTPException
from sqlalchemy import text
from .database import engine

router = APIRouter(prefix="/students", tags=["Students"])


@router.get("/{student_id}")
def get_student(student_id: int):

    query = text("""
        SELECT
            student_id,
            campus_id,
            academic_year_id,
            admission_id,
            student_code,
            roll_number,
            first_name,
            last_name,
            date_of_birth,
            gender,
            phone,
            email,
            address,
            city,
            state,
            photo,
            blood_group,
            group_id,
            section_id,
            status,
            created_at,
            updated_at
        FROM jclg_student
        WHERE student_id = :student_id
    """)

    try:
        with engine.connect() as connection:
            result = connection.execute(
                query,
                {"student_id": student_id}
            )

            student = result.mappings().first()

            if not student:
                raise HTTPException(
                    status_code=404,
                    detail="Student not found"
                )

            return {
                "success": True,
                "data": dict(student)
            }

    except HTTPException:
        raise

    except Exception as e:
        print(f"Error fetching student: {e}")
        raise HTTPException(
            status_code=500,
            detail="Error fetching student"
        )