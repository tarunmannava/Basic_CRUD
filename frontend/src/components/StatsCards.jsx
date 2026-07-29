import React from 'react';
import { ListTodo, CheckCircle, Clock, AlertTriangle } from 'lucide-react';

export default function StatsCards({ stats }) {
  if (!stats) return null;

  return (
    <div className="stats-grid">
      <div className="stat-card">
        <div className="stat-info">
          <span className="stat-label">Total Tasks</span>
          <div className="stat-value">{stats.total}</div>
        </div>
        <div className="stat-icon-wrapper">
          <ListTodo size={22} />
        </div>
      </div>

      <div className="stat-card">
        <div className="stat-info">
          <span className="stat-label">Completed</span>
          <div className="stat-value">{stats.completed}</div>
        </div>
        <div className="stat-icon-wrapper success">
          <CheckCircle size={22} />
        </div>
      </div>

      <div className="stat-card">
        <div className="stat-info">
          <span className="stat-label">In Progress</span>
          <div className="stat-value">{stats.in_progress}</div>
        </div>
        <div className="stat-icon-wrapper warning">
          <Clock size={22} />
        </div>
      </div>

      <div className="stat-card">
        <div className="stat-info">
          <span className="stat-label">High Priority</span>
          <div className="stat-value">{stats.high_priority}</div>
        </div>
        <div className="stat-icon-wrapper danger">
          <AlertTriangle size={22} />
        </div>
      </div>
    </div>
  );
}
