from sqlalchemy.orm import Session
from sqlalchemy import or_, func
from models import Task
from schemas import TaskCreate, TaskUpdate
from datetime import datetime, timezone

def get_tasks(
    db: Session,
    search: str = None,
    category: str = None,
    status: str = None,
    priority: str = None,
    skip: int = 0,
    limit: int = 100
):
    query = db.query(Task)
    if search:
        pattern = f"%{search}%"
        query = query.filter(
            or_(Task.title.ilike(pattern), Task.description.ilike(pattern))
        )
    if category and category.lower() != "all":
        query = query.filter(Task.category.ilike(category))
    if status and status.lower() != "all":
        query = query.filter(Task.status.ilike(status))
    if priority and priority.lower() != "all":
        query = query.filter(Task.priority.ilike(priority))
    
    return query.order_by(Task.updated_at.desc()).offset(skip).limit(limit).all()

def get_task(db: Session, task_id: int):
    return db.query(Task).filter(Task.id == task_id).first()

def create_task(db: Session, task: TaskCreate):
    db_task = Task(**task.model_dump())
    db.add(db_task)
    db.commit()
    db.refresh(db_task)
    return db_task

def update_task(db: Session, task_id: int, task_data: TaskUpdate):
    db_task = get_task(db, task_id)
    if not db_task:
        return None
    
    update_dict = task_data.model_dump(exclude_unset=True)
    for key, value in update_dict.items():
        setattr(db_task, key, value)
    
    db_task.updated_at = datetime.now(timezone.utc)
    db.commit()
    db.refresh(db_task)
    return db_task

def delete_task(db: Session, task_id: int):
    db_task = get_task(db, task_id)
    if not db_task:
        return False
    db.delete(db_task)
    db.commit()
    return True

def get_stats(db: Session):
    total = db.query(Task).count()
    completed = db.query(Task).filter(Task.status.ilike("completed")).count()
    in_progress = db.query(Task).filter(Task.status.ilike("in progress")).count()
    pending = db.query(Task).filter(Task.status.ilike("pending")).count()
    high_priority = db.query(Task).filter(Task.priority.ilike("high")).count()
    
    return {
        "total": total,
        "completed": completed,
        "in_progress": in_progress,
        "pending": pending,
        "high_priority": high_priority
    }
