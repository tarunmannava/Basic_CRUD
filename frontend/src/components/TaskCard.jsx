import React from 'react';
import { Calendar, Edit3, Trash2, Tag, ArrowUpRight } from 'lucide-react';

export default function TaskCard({ task, onEdit, onDelete, onStatusChange }) {
  const getPriorityClass = (priority) => {
    switch (priority?.toLowerCase()) {
      case 'high': return 'high-priority';
      case 'medium': return 'medium-priority';
      case 'low': return 'low-priority';
      default: return '';
    }
  };

  const getStatusBadgeClass = (status) => {
    switch (status?.toLowerCase()) {
      case 'completed': return 'badge-status completed';
      case 'in progress': return 'badge-status in-progress';
      default: return 'badge-status pending';
    }
  };

  const getPriorityBadgeClass = (priority) => {
    switch (priority?.toLowerCase()) {
      case 'high': return 'badge badge-priority-high';
      case 'medium': return 'badge badge-priority-medium';
      default: return 'badge badge-priority-low';
    }
  };

  const nextStatusMap = {
    'Pending': 'In Progress',
    'In Progress': 'Completed',
    'Completed': 'Pending'
  };

  const handleCycleStatus = (e) => {
    e.stopPropagation();
    const nextStatus = nextStatusMap[task.status] || 'Pending';
    onStatusChange(task.id, nextStatus);
  };

  return (
    <div className={`task-card ${getPriorityClass(task.priority)}`}>
      <div className="task-header">
        <h3 className="task-title">{task.title}</h3>
        <button 
          className={getStatusBadgeClass(task.status)}
          onClick={handleCycleStatus}
          title="Click to cycle status"
        >
          {task.status}
        </button>
      </div>

      {task.description && (
        <p className="task-description">{task.description}</p>
      )}

      <div className="task-tags">
        <span className="badge badge-category">
          <Tag size={12} />
          {task.category}
        </span>
        <span className={getPriorityBadgeClass(task.priority)}>
          {task.priority}
        </span>
      </div>

      <div className="task-footer">
        <div className="task-due">
          <Calendar size={14} />
          <span>{task.due_date || 'No due date'}</span>
        </div>

        <div className="task-actions">
          <button 
            className="btn-icon" 
            onClick={() => onEdit(task)}
            title="Edit Task"
          >
            <Edit3 size={16} />
          </button>
          <button 
            className="btn-icon delete" 
            onClick={() => onDelete(task.id)}
            title="Delete Task"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
