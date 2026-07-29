import React from 'react';
import TaskCard from './TaskCard';
import { FolderOpen, Plus } from 'lucide-react';

export default function TaskList({ tasks, loading, onEdit, onDelete, onStatusChange, onOpenCreateModal }) {
  if (loading && tasks.length === 0) {
    return (
      <div className="empty-state">
        <p className="empty-desc">Loading tasks from FastAPI...</p>
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-icon">
          <FolderOpen size={48} />
        </div>
        <h3 className="empty-title">No tasks found</h3>
        <p className="empty-desc">There are no tasks matching your active search or filter criteria.</p>
        <button className="btn-primary" onClick={onOpenCreateModal}>
          <Plus size={18} />
          Create First Task
        </button>
      </div>
    );
  }

  return (
    <div className="tasks-grid">
      {tasks.map((task) => (
        <TaskCard
          key={task.id}
          task={task}
          onEdit={onEdit}
          onDelete={onDelete}
          onStatusChange={onStatusChange}
        />
      ))}
    </div>
  );
}
