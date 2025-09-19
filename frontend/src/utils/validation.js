// Client-side validation utilities
export const validateTask = (taskData) => {
  const errors = {}

  // Title validation
  if (!taskData.title || taskData.title.trim().length === 0) {
    errors.title = "Title is required"
  } else if (taskData.title.length > 200) {
    errors.title = "Title must not exceed 200 characters"
  }

  // Description validation
  if (taskData.description && taskData.description.length > 1000) {
    errors.description = "Description must not exceed 1000 characters"
  }

  // Status validation
  const validStatuses = ["pending", "in-progress", "completed"]
  if (taskData.status && !validStatuses.includes(taskData.status)) {
    errors.status = "Invalid status"
  }

  // Due date validation
  if (!taskData.dueDate) {
    errors.dueDate = "Due date is required"
  } else {
    const dueDate = new Date(taskData.dueDate)
    if (isNaN(dueDate.getTime())) {
      errors.dueDate = "Invalid due date"
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  }
}

export const sanitizeInput = (input) => {
  if (typeof input !== "string") return input

  // Basic XSS prevention - remove script tags and javascript: protocols
  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    .replace(/javascript:/gi, "")
    .trim()
}

export const formatDate = (date) => {
  try {
    return new Date(date).toISOString()
  } catch {
    return null
  }
}
