import React from 'react';
import { Search, Plus, Filter } from 'lucide-react';

export default function FilterBar({ filters, setFilters, onOpenCreateModal }) {
  return (
    <div className="filter-bar">
      <div className="filter-search-group">
        <div className="search-input-wrapper">
          <Search />
          <input
            type="text"
            className="search-input"
            placeholder="Search tasks by title or keyword..."
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
          />
        </div>

        <div className="filter-selects">
          <select
            className="filter-select"
            value={filters.category}
            onChange={(e) => setFilters({ ...filters, category: e.target.value })}
          >
            <option value="All">All Categories</option>
            <option value="Work">Work</option>
            <option value="Design">Design</option>
            <option value="Personal">Personal</option>
            <option value="Documentation">Documentation</option>
            <option value="Ideas">Ideas</option>
          </select>

          <select
            className="filter-select"
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
          >
            <option value="All">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>

          <select
            className="filter-select"
            value={filters.priority}
            onChange={(e) => setFilters({ ...filters, priority: e.target.value })}
          >
            <option value="All">All Priorities</option>
            <option value="High">High Priority</option>
            <option value="Medium">Medium Priority</option>
            <option value="Low">Low Priority</option>
          </select>
        </div>
      </div>

      <button className="btn-primary" onClick={onOpenCreateModal}>
        <Plus size={18} />
        New Task
      </button>
    </div>
  );
}
