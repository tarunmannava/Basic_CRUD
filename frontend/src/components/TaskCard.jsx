import React from 'react';
import { Calendar, Edit3, Trash2, Tag, CheckSquare } from 'lucide-react';

export default function TaskCard({ task, onEdit, onDelete, onStatusChange, onToggleSubtask }) {
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

  const subtasks = task.subtasks || [];
  const totalSubtasks = subtasks.length;
  const completedSubtasks = subtasks.filter(s => s.completed).length;
  const progressPercent = totalSubtasks > 0 ? Math.round((completedSubtasks / totalSubtasks) * 100) : 0;

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

      {totalSubtasks > 0 && (
        <div className="subtasks-section">
          <div className="subtasks-header">
            <span className="subtasks-count">
              <CheckSquare size={13} /> {completedSubtasks}/{totalSubtasks} Subtasks
            </span>
            <span className="subtasks-percentage">{progressPercent}%</span>
          </div>
          <div className="subtasks-progress-bg">
            <div 
              className="subtasks-progress-fill" 
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          <div className="subtasks-checklist">
            {subtasks.map((st) => (
              <div 
                key={st.id} 
                className={`subtask-item ${st.completed ? 'completed' : ''}`}
                onClick={(e) => {
                  e.stopPropagation();
                  if (onToggleSubtask) onToggleSubtask(task.id, st.id);
                }}
              >
                <input 
                  type="checkbox" 
                  checked={st.completed} 
                  readOnly 
                />
                <span className="subtask-title">{st.title}</span>
              </div>
            ))}
          </div>
        </div>
      )}

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
