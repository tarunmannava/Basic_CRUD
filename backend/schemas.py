from pydantic import BaseModel, Field
from typing import Optional, List, Any
from datetime import datetime

class SubtaskItem(BaseModel):
    id: str
    title: str
    completed: bool = False

class TaskBase(BaseModel):
    title: str = Field(..., min_length=1, max_length=200, example="Design homepage layout")
    description: Optional[str] = Field(None, example="Create responsive wireframes and color scheme")
    category: str = Field(default="Personal", example="Work")
    priority: str = Field(default="Medium", example="High")
    status: str = Field(default="Pending", example="In Progress")
    due_date: Optional[str] = Field(None, example="2026-08-15")
    subtasks: List[SubtaskItem] = Field(default_factory=list)

class TaskCreate(TaskBase):
    pass

class TaskUpdate(BaseModel):
    title: Optional[str] = Field(None, min_length=1, max_length=200)
    description: Optional[str] = None
    category: Optional[str] = None
    priority: Optional[str] = None
    status: Optional[str] = None
    due_date: Optional[str] = None
    subtasks: Optional[List[SubtaskItem]] = None

class TaskResponse(TaskBase):
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class StatsResponse(BaseModel):
    total: int
    completed: int
    in_progress: int
    pending: int
    high_priority: int
