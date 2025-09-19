const express = require("express")
const { body, param, validationResult } = require("express-validator")
const Task = require("../models/Task")

const router = express.Router()

// Validation middleware
const validateTask = [
  body("title")
    .trim()
    .notEmpty()
    .withMessage("Title is required")
    .isLength({ min: 1, max: 200 })
    .withMessage("Title must be between 1 and 200 characters"),
  body("description")
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage("Description must not exceed 1000 characters"),
  body("status")
    .optional()
    .isIn(["pending", "in-progress", "completed"])
    .withMessage("Status must be one of: pending, in-progress, completed"),
  body("dueDate")
    .notEmpty()
    .withMessage("Due date is required")
    .isISO8601()
    .withMessage("Due date must be a valid ISO 8601 date"),
]

const validateId = [
  param("id").notEmpty().withMessage("Task ID is required").isUUID().withMessage("Task ID must be a valid UUID"),
]

// Error handling middleware for validation
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: "Validation failed",
      details: errors.array(),
    })
  }
  next()
}

// GET /api/tasks - Retrieve all tasks
router.get("/", async (req, res, next) => {
  try {
    const tasks = await Task.findAll()
    res.json({
      success: true,
      data: tasks,
      count: tasks.length,
    })
  } catch (error) {
    next(error)
  }
})

// GET /api/tasks/:id - Retrieve a specific task
router.get("/:id", validateId, handleValidationErrors, async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id)
    if (!task) {
      return res.status(404).json({
        success: false,
        error: "Task not found",
      })
    }
    res.json({
      success: true,
      data: task,
    })
  } catch (error) {
    next(error)
  }
})

// POST /api/tasks - Create a new task
router.post("/", validateTask, handleValidationErrors, async (req, res, next) => {
  try {
    const task = new Task(req.body)
    await task.save()
    res.status(201).json({
      success: true,
      data: task,
      message: "Task created successfully",
    })
  } catch (error) {
    next(error)
  }
})

// PUT /api/tasks/:id - Update a task
router.put("/:id", [...validateId, ...validateTask], handleValidationErrors, async (req, res, next) => {
  try {
    const existingTask = await Task.findById(req.params.id)
    if (!existingTask) {
      return res.status(404).json({
        success: false,
        error: "Task not found",
      })
    }

    // Update task properties
    existingTask.title = req.body.title
    existingTask.description = req.body.description || ""
    existingTask.status = req.body.status || existingTask.status
    existingTask.dueDate = req.body.dueDate

    await existingTask.save()
    res.json({
      success: true,
      data: existingTask,
      message: "Task updated successfully",
    })
  } catch (error) {
    next(error)
  }
})

// PATCH /api/tasks/:id/status - Update task status only
router.patch(
  "/:id/status",
  param("id").isUUID().withMessage("Task ID must be a valid UUID"),
  body("status").isIn(["pending", "in-progress", "completed"]).withMessage("Invalid status"),
  handleValidationErrors,
  async (req, res, next) => {
    try {
      const task = await Task.findById(req.params.id)
      if (!task) {
        return res.status(404).json({
          success: false,
          error: "Task not found",
        })
      }

      task.status = req.body.status
      await task.save()

      res.json({
        success: true,
        data: task,
        message: "Task status updated successfully",
      })
    } catch (error) {
      next(error)
    }
  },
)

// DELETE /api/tasks/:id - Delete a task
router.delete("/:id", validateId, handleValidationErrors, async (req, res, next) => {
  try {
    const deleted = await Task.deleteById(req.params.id)
    if (!deleted) {
      return res.status(404).json({
        success: false,
        error: "Task not found",
      })
    }
    res.json({
      success: true,
      message: "Task deleted successfully",
    })
  } catch (error) {
    next(error)
  }
})

module.exports = router
