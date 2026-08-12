from fastapi import FastAPI, Depends, HTTPException, Query, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List, Optional

import models
import schemas
import crud
from database import engine, get_db

from sqlalchemy import text, or_

# Create database tables
models.Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Task Hub API",
    description="RESTful CRUD API for managing tasks and projects",
    version="1.0.0"
)

# Enable CORS for React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Seed initial data if DB is empty & ensure subtasks column exists
@app.on_event("startup")
def startup_event():
    with engine.connect() as conn:
        try:
            conn.execute(text("SELECT subtasks FROM tasks LIMIT 1"))
        except Exception:
            conn.execute(text("ALTER TABLE tasks ADD COLUMN subtasks TEXT DEFAULT '[]'"))
            conn.commit()

    db = next(get_db())
    if db.query(models.Task).count() == 0:
        sample_tasks = [
            models.Task(
                title="Design FastAPI & React Architecture",
                description="Set up clean backend database models and responsive React component structure.",
                category="Work",
                priority="High",
                status="Completed",
                due_date="2026-08-01",
                subtasks='[{"id": "s1", "title": "Setup FastAPI models", "completed": true}, {"id": "s2", "title": "Setup React layout", "completed": true}]'
            ),
            models.Task(
                title="Implement Dark & Light Theme UI",
                description="Use CSS variables and glassmorphism styling for maximum aesthetic appeal.",
                category="Design",
                priority="High",
                status="In Progress",
                due_date="2026-08-05",
                subtasks='[{"id": "s1", "title": "Color palette selection", "completed": true}, {"id": "s2", "title": "CSS transition animations", "completed": false}]'
            ),
            models.Task(
                title="Prepare Documentation & Walkthrough",
                description="Write clear instructions for running backend server and React client.",
                category="Documentation",
                priority="Medium",
                status="Pending",
                due_date="2026-08-10",
                subtasks='[{"id": "s1", "title": "Draft implementation plan", "completed": true}, {"id": "s2", "title": "Create walkthrough document", "completed": false}]'
            ),
            models.Task(
                title="Explore AI Integration Features",
                description="Brainstorm auto-tagging and intelligent task prioritization.",
                category="Ideas",
                priority="Low",
                status="Pending",
                due_date="2026-08-20",
                subtasks='[]'
            )
        ]
        db.add_all(sample_tasks)
        db.commit()

@app.get("/")
def read_root():
    return {"status": "ok", "message": "FastAPI Task Hub Backend active", "docs": "/docs"}

@app.get("/api/stats", response_model=schemas.StatsResponse)
def get_task_stats(db: Session = Depends(get_db)):
    return crud.get_stats(db)

@app.get("/api/tasks", response_model=List[schemas.TaskResponse])
def read_tasks(
    search: Optional[str] = Query(None, description="Search keyword in title or description"),
    category: Optional[str] = Query(None, description="Filter by category"),
    status: Optional[str] = Query(None, description="Filter by status"),
    priority: Optional[str] = Query(None, description="Filter by priority"),
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    return crud.get_tasks(
        db, search=search, category=category, status=status, priority=priority, skip=skip, limit=limit
    )

@app.get("/api/tasks/{task_id}", response_model=schemas.TaskResponse)
def read_task(task_id: int, db: Session = Depends(get_db)):
    task = crud.get_task(db, task_id=task_id)
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    return task

@app.post("/api/tasks", response_model=schemas.TaskResponse, status_code=status.HTTP_201_CREATED)
def create_task(task: schemas.TaskCreate, db: Session = Depends(get_db)):
    return crud.create_task(db=db, task=task)

@app.put("/api/tasks/{task_id}", response_model=schemas.TaskResponse)
def update_task(task_id: int, task: schemas.TaskUpdate, db: Session = Depends(get_db)):
    updated_task = crud.update_task(db=db, task_id=task_id, task_data=task)
    if not updated_task:
        raise HTTPException(status_code=404, detail="Task not found")
    return updated_task

@app.put("/api/tasks/{task_id}/subtasks/{subtask_id}/toggle", response_model=schemas.TaskResponse)
def toggle_subtask(task_id: int, subtask_id: str, db: Session = Depends(get_db)):
    updated_task = crud.toggle_subtask(db=db, task_id=task_id, subtask_id=subtask_id)
    if not updated_task:
        raise HTTPException(status_code=404, detail="Task not found")
    return updated_task

@app.delete("/api/tasks/{task_id}", status_code=status.HTTP_200_OK)
def delete_task(task_id: int, db: Session = Depends(get_db)):
    success = crud.delete_task(db=db, task_id=task_id)
    if not success:
        raise HTTPException(status_code=404, detail="Task not found")
    return {"message": "Task successfully deleted", "id": task_id}

