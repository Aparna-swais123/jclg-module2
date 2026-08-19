from fastapi import APIRouter

router = APIRouter(
    prefix="/attendance",
    tags=["Attendance"]
)

@router.get("/students/{student_id}/percentage")
def get_attendance_percentage(student_id: int):
    return {
        "student_id": student_id,
        "message": "Attendance percentage API"
    }