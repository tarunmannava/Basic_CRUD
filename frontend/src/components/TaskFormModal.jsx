import React, { useState, useEffect } from 'react';
import { X, Check, Plus, Trash2, CheckSquare } from 'lucide-react';

export default function TaskFormModal({ isOpen, onClose, onSave, taskToEdit }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Work',
    priority: 'Medium',
    status: 'Pending',
    due_date: '',
    subtasks: [],
  });

  const [newSubtaskTitle, setNewSubtaskTitle] = useState('');

  useEffect(() => {
    if (taskToEdit) {
      setFormData({
        title: taskToEdit.title || '',
        description: taskToEdit.description || '',
        category: taskToEdit.category || 'Work',
        priority: taskToEdit.priority || 'Medium',
        status: taskToEdit.status || 'Pending',
        due_date: taskToEdit.due_date || '',
        subtasks: taskToEdit.subtasks || [],
      });
    } else {
      setFormData({
        title: '',
        description: '',
        category: 'Work',
        priority: 'Medium',
        status: 'Pending',
        due_date: '',
        subtasks: [],
      });
    }
    setNewSubtaskTitle('');
  }, [taskToEdit, isOpen]);

  if (!isOpen) return null;

  const handleAddSubtask = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!newSubtaskTitle.trim()) return;
    const newSubtask = {
      id: 'st-' + Date.now() + '-' + Math.floor(Math.random() * 1000),
      title: newSubtaskTitle.trim(),
      completed: false,
    };
    setFormData({
      ...formData,
      subtasks: [...formData.subtasks, newSubtask],
    });
    setNewSubtaskTitle('');
  };

  const handleRemoveSubtask = (id) => {
    setFormData({
      ...formData,
      subtasks: formData.subtasks.filter((st) => st.id !== id),
    });
  };

  const handleToggleSubtaskInForm = (id) => {
    setFormData({
      ...formData,
      subtasks: formData.subtasks.map((st) =>
        st.id === id ? { ...st, completed: !st.completed } : st
      ),
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title.trim()) return;
    onSave(formData);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">
            {taskToEdit ? 'Edit Task' : 'Create New Task'}
          </h2>
          <button className="btn-icon" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-group">
              <label className="form-label">Task Title *</label>
              <input
                type="text"
                className="form-control"
                placeholder="e.g. Build REST API Endpoints"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
                autoFocus
              />
            </div>

            <div className="form-group">
              <label className="form-label">Description</label>
              <textarea
                className="form-control"
                placeholder="Add detail or steps required to complete this task..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>

            {/* Subtasks Section */}
            <div className="form-group">
              <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <CheckSquare size={16} /> Subtasks / Checklist
              </label>

              <div className="subtask-add-row" style={{ display: 'flex', gap: '8px', marginBottom: '10px' }}>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Add a subtask..."
                  value={newSubtaskTitle}
                  onChange={(e) => setNewSubtaskTitle(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddSubtask(e);
                    }
                  }}
                />
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={handleAddSubtask}
                  style={{ whiteSpace: 'nowrap' }}
                >
                  <Plus size={16} /> Add
                </button>
              </div>

              {formData.subtasks.length > 0 && (
                <div className="form-subtasks-list">
                  {formData.subtasks.map((st) => (
                    <div key={st.id} className="form-subtask-item">
                      <input
                        type="checkbox"
                        checked={st.completed}
                        onChange={() => handleToggleSubtaskInForm(st.id)}
                      />
                      <span className={st.completed ? 'completed-text' : ''}>{st.title}</span>
                      <button
                        type="button"
                        className="btn-icon delete"
                        onClick={() => handleRemoveSubtask(st.id)}
                        title="Remove Subtask"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Category</label>
                <select
                  className="form-control"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                >
                  <option value="Work">Work</option>
                  <option value="Design">Design</option>
                  <option value="Personal">Personal</option>
                  <option value="Documentation">Documentation</option>
                  <option value="Ideas">Ideas</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Priority</label>
                <select
                  className="form-control"
                  value={formData.priority}
                  onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Status</label>
                <select
                  className="form-control"
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                >
                  <option value="Pending">Pending</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Due Date</label>
                <input
                  type="date"
                  className="form-control"
                  value={formData.due_date}
                  onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
                />
              </div>
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              <Check size={18} />
              {taskToEdit ? 'Save Changes' : 'Create Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
