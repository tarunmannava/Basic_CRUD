import json
from sqlalchemy.orm import Session
from sqlalchemy import or_, func
from models import Task
from schemas import TaskCreate, TaskUpdate
from datetime import datetime, timezone

def format_task_dict(task: Task):
    if not task:
        return None
    subtasks = []
    if task.subtasks:
        try:
            subtasks = json.loads(task.subtasks)
        except Exception:
            subtasks = []
    
    return {
        "id": task.id,
        "title": task.title,
        "description": task.description,
        "category": task.category,
        "priority": task.priority,
        "status": task.status,
        "due_date": task.due_date,
        "subtasks": subtasks,
        "created_at": task.created_at,
        "updated_at": task.updated_at
    }

def get_task_model(db: Session, task_id: int):
    return db.query(Task).filter(Task.id == task_id).first()

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
    
    tasks = query.order_by(Task.updated_at.desc()).offset(skip).limit(limit).all()
    return [format_task_dict(t) for t in tasks]

def get_task(db: Session, task_id: int):
    db_task = get_task_model(db, task_id)
    return format_task_dict(db_task)

def create_task(db: Session, task: TaskCreate):
    task_data = task.model_dump()
    if "subtasks" in task_data and isinstance(task_data["subtasks"], list):
        task_data["subtasks"] = json.dumps(task_data["subtasks"])
    db_task = Task(**task_data)
    db.add(db_task)
    db.commit()
    db.refresh(db_task)
    return format_task_dict(db_task)

def update_task(db: Session, task_id: int, task_data: TaskUpdate):
    db_task = get_task_model(db, task_id)
    if not db_task:
        return None
    
    update_dict = task_data.model_dump(exclude_unset=True)
    if "subtasks" in update_dict and isinstance(update_dict["subtasks"], list):
        update_dict["subtasks"] = json.dumps(update_dict["subtasks"])
        
    for key, value in update_dict.items():
        setattr(db_task, key, value)
    
    db_task.updated_at = datetime.now(timezone.utc)
    db.commit()
    db.refresh(db_task)
    return format_task_dict(db_task)

def toggle_subtask(db: Session, task_id: int, subtask_id: str):
    db_task = get_task_model(db, task_id)
    if not db_task:
        return None
    
    subtasks = []
    if db_task.subtasks:
        try:
            subtasks = json.loads(db_task.subtasks)
        except Exception:
            subtasks = []
            
    for item in subtasks:
        if str(item.get("id")) == str(subtask_id):
            item["completed"] = not item.get("completed", False)
            break
            
    db_task.subtasks = json.dumps(subtasks)
    db_task.updated_at = datetime.now(timezone.utc)
    db.commit()
    db.refresh(db_task)
    return format_task_dict(db_task)

def delete_task(db: Session, task_id: int):
    db_task = get_task_model(db, task_id)
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

