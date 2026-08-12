const API_BASE_URL = "http://localhost:8000/api";

export async function fetchStats() {
  const response = await fetch(`${API_BASE_URL}/stats`);
  if (!response.ok) {
    throw new Error(`Failed to fetch stats: ${response.statusText}`);
  }
  return response.json();
}

export async function fetchTasks(filters = {}) {
  const params = new URLSearchParams();
  if (filters.search) params.append("search", filters.search);
  if (filters.category && filters.category !== "All") params.append("category", filters.category);
  if (filters.status && filters.status !== "All") params.append("status", filters.status);
  if (filters.priority && filters.priority !== "All") params.append("priority", filters.priority);

  const url = `${API_BASE_URL}/tasks?${params.toString()}`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch tasks: ${response.statusText}`);
  }
  return response.json();
}

export async function createTask(taskData) {
  const response = await fetch(`${API_BASE_URL}/tasks`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(taskData),
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || "Failed to create task");
  }
  return response.json();
}

export async function updateTask(id, taskData) {
  const response = await fetch(`${API_BASE_URL}/tasks/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(taskData),
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || "Failed to update task");
  }
  return response.json();
}

export async function deleteTask(id) {
  const response = await fetch(`${API_BASE_URL}/tasks/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) {
    throw new Error(`Failed to delete task: ${response.statusText}`);
  }
  return response.json();
}

export async function toggleSubtask(taskId, subtaskId) {
  const response = await fetch(`${API_BASE_URL}/tasks/${taskId}/subtasks/${subtaskId}/toggle`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || "Failed to toggle subtask");
  }
  return response.json();
}
