// Application constants
export const TASK_STATUS = {
  PENDING: "pending",
  IN_PROGRESS: "in-progress",
  COMPLETED: "completed",
}

export const TASK_STATUS_LABELS = {
  [TASK_STATUS.PENDING]: "Pending",
  [TASK_STATUS.IN_PROGRESS]: "In Progress",
  [TASK_STATUS.COMPLETED]: "Completed",
}

export const SORT_OPTIONS = {
  DUE_DATE: "dueDate",
  CREATED_AT: "createdAt",
  TITLE: "title",
  STATUS: "status",
}

export const SORT_ORDER = {
  ASC: "asc",
  DESC: "desc",
}

export const API_ENDPOINTS = {
  TASKS: "/tasks",
  TASK_BY_ID: (id) => `/tasks/${id}`,
  TASK_STATUS: (id) => `/tasks/${id}/status`,
}

export const ERROR_MESSAGES = {
  NETWORK_ERROR: "Network error. Please check your connection.",
  TASK_NOT_FOUND: "Task not found",
  VALIDATION_FAILED: "Please check your input and try again",
  GENERIC_ERROR: "Something went wrong. Please try again.",
}

export const SUCCESS_MESSAGES = {
  TASK_CREATED: "Task created successfully",
  TASK_UPDATED: "Task updated successfully",
  TASK_DELETED: "Task deleted successfully",
  STATUS_UPDATED: "Task status updated successfully",
}
