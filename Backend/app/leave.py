from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from pydantic import BaseModel
from sqlalchemy import text

from .database import get_db


router = APIRouter(
    prefix="/leaves",
    tags=["Leaves"]
)

class LeaveRequest(BaseModel):
    leave_type: str
    from_date: str
    to_date: str
    reason: str

@router.post("/students/{student_id}")
def apply_for_leave(
    student_id: int,
    leave_request: LeaveRequest,
    db: Session = Depends(get_db)
):
    query = text("""
        INSERT INTO jclg_leave
        (
            student_id,
            leave_type,
            from_date,
            to_date,
            reason,
            status
        )
        VALUES
        (
            :student_id,
            :leave_type,
            :from_date,
            :to_date,
            :reason,
            'PENDING'
        )
        RETURNING leave_id
    """)

    result = db.execute(
        query,
        {
            "student_id": student_id,
            "leave_type": leave_request.leave_type,
            "from_date": leave_request.from_date,
            "to_date": leave_request.to_date,
            "reason": leave_request.reason
        }
    )

    leave_id = result.scalar()

    db.commit()

    return {
        "leave_id": leave_id,
        "student_id": student_id,
        "leave_type": leave_request.leave_type,
        "from_date": leave_request.from_date,
        "to_date": leave_request.to_date,
        "reason": leave_request.reason,
        "status": "PENDING"
    }


@router.get("/students/{student_id}")
def get_student_leaves(
    student_id: int,
    db: Session = Depends(get_db)
):
    query = text("""
        SELECT
            leave_id,
            leave_type,
            from_date,
            to_date,
            reason,
            status,
            remarks,
            approved_at
        FROM jclg_leave
        WHERE student_id = :student_id
        ORDER BY created_at DESC
    """)

    result = db.execute(
        query,
        {"student_id": student_id}
    )

    leaves = result.mappings().all()

    return {
        "student_id": student_id,
        "leaves": leaves
    }