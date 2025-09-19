const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3001/api"

class ApiError extends Error {
  constructor(message, status, data) {
    super(message)
    this.name = "ApiError"
    this.status = status
    this.data = data
  }
}

const handleResponse = async (response) => {
  if (!response.ok) {
    let errorData
    try {
      errorData = await response.json()
    } catch {
      errorData = { error: "Network error occurred" }
    }

    throw new ApiError(errorData.error || `HTTP ${response.status}`, response.status, errorData)
  }

  return response.json()
}

const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`

  const config = {
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    ...options,
  }

  if (config.body && typeof config.body === "object") {
    config.body = JSON.stringify(config.body)
  }

  try {
    const response = await fetch(url, config)
    return await handleResponse(response)
  } catch (error) {
    if (error instanceof ApiError) {
      throw error
    }

    // Network or other errors
    throw new ApiError("Network error. Please check your connection.", 0, { originalError: error.message })
  }
}

export const taskApi = {
  // Get all tasks
  getAllTasks: () => apiRequest("/tasks"),

  // Get single task
  getTask: (id) => apiRequest(`/tasks/${id}`),

  // Create new task
  createTask: (taskData) =>
    apiRequest("/tasks", {
      method: "POST",
      body: taskData,
    }),

  // Update task
  updateTask: (id, taskData) =>
    apiRequest(`/tasks/${id}`, {
      method: "PUT",
      body: taskData,
    }),

  // Update task status only
  updateTaskStatus: (id, status) =>
    apiRequest(`/tasks/${id}/status`, {
      method: "PATCH",
      body: { status },
    }),

  // Delete task
  deleteTask: (id) =>
    apiRequest(`/tasks/${id}`, {
      method: "DELETE",
    }),
}

export { ApiError }
