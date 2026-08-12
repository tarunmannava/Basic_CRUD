import React, { useState, useEffect, useCallback } from 'react';
import Navbar from './components/Navbar';
import StatsCards from './components/StatsCards';
import FilterBar from './components/FilterBar';
import TaskList from './components/TaskList';
import TaskFormModal from './components/TaskFormModal';
import ToastNotification from './components/ToastNotification';
import { fetchTasks, fetchStats, createTask, updateTask, deleteTask, toggleSubtask } from './api';

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isOnline, setIsOnline] = useState(true);
  const [toasts, setToasts] = useState([]);

  const [filters, setFilters] = useState({
    search: '',
    category: 'All',
    status: 'All',
    priority: 'All',
  });

  const [modalOpen, setModalOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState(null);

  const addToast = (message, type = 'info') => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [fetchedTasks, fetchedStats] = await Promise.all([
        fetchTasks(filters),
        fetchStats(),
      ]);
      setTasks(fetchedTasks);
      setStats(fetchedStats);
      setIsOnline(true);
    } catch (err) {
      console.error(err);
      setIsOnline(false);
      addToast(`Could not connect to FastAPI server at http://localhost:8000`, 'error');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleOpenCreateModal = () => {
    setTaskToEdit(null);
    setModalOpen(true);
  };

  const handleOpenEditModal = (task) => {
    setTaskToEdit(task);
    setModalOpen(true);
  };

  const handleSaveTask = async (formData) => {
    try {
      if (taskToEdit) {
        await updateTask(taskToEdit.id, formData);
        addToast('Task updated successfully', 'success');
      } else {
        await createTask(formData);
        addToast('New task created successfully', 'success');
      }
      setModalOpen(false);
      loadData();
    } catch (err) {
      addToast(err.message || 'Failed to save task', 'error');
    }
  };

  const handleDeleteTask = async (id) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;
    try {
      await deleteTask(id);
      addToast('Task deleted successfully', 'success');
      loadData();
    } catch (err) {
      addToast(err.message || 'Failed to delete task', 'error');
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await updateTask(id, { status: newStatus });
      addToast(`Task status changed to ${newStatus}`, 'info');
      loadData();
    } catch (err) {
      addToast(err.message || 'Failed to update task status', 'error');
    }
  };

  const handleToggleSubtask = async (taskId, subtaskId) => {
    try {
      await toggleSubtask(taskId, subtaskId);
      loadData();
    } catch (err) {
      addToast(err.message || 'Failed to update subtask', 'error');
    }
  };

  return (
    <div className="app-container">
      <Navbar 
        isOnline={isOnline} 
        onRefresh={loadData} 
        loading={loading} 
      />

      <StatsCards stats={stats} />

      <FilterBar
        filters={filters}
        setFilters={setFilters}
        onOpenCreateModal={handleOpenCreateModal}
      />

      <TaskList
        tasks={tasks}
        loading={loading}
        onEdit={handleOpenEditModal}
        onDelete={handleDeleteTask}
        onStatusChange={handleStatusChange}
        onToggleSubtask={handleToggleSubtask}
        onOpenCreateModal={handleOpenCreateModal}
      />

      <TaskFormModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSaveTask}
        taskToEdit={taskToEdit}
      />

      <ToastNotification 
        toasts={toasts} 
        onDismiss={removeToast} 
      />
    </div>
  );
}
