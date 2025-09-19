const Task = require("../../models/Task")
const { initializeDatabase, closeDatabase } = require("../../database/db")

describe("Task Model", () => {
  beforeAll(async () => {
    await initializeDatabase()
  })

  afterAll(async () => {
    await closeDatabase()
  })

  beforeEach(async () => {
    // Clear tasks table before each test
    const { getDatabase } = require("../../database/db")
    const db = getDatabase()
    await new Promise((resolve) => {
      db.run("DELETE FROM tasks", resolve)
    })
  })

  describe("Task Creation", () => {
    it("should create a task with valid data", async () => {
      const taskData = {
        title: "Test Task",
        description: "Test Description",
        status: "pending",
        dueDate: new Date().toISOString(),
      }

      const task = new Task(taskData)
      await task.save()

      expect(task.id).toBeDefined()
      expect(task.title).toBe(taskData.title)
      expect(task.description).toBe(taskData.description)
      expect(task.status).toBe(taskData.status)
    })

    it("should generate UUID for new task", () => {
      const task = new Task({ title: "Test", dueDate: new Date().toISOString() })
      expect(task.id).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i)
    })

    it("should set default values", () => {
      const task = new Task({ title: "Test", dueDate: new Date().toISOString() })
      expect(task.description).toBe("")
      expect(task.status).toBe("pending")
      expect(task.createdAt).toBeDefined()
      expect(task.updatedAt).toBeDefined()
    })
  })

  describe("Task Retrieval", () => {
    it("should find all tasks", async () => {
      const task1 = new Task({ title: "Task 1", dueDate: new Date().toISOString() })
      const task2 = new Task({ title: "Task 2", dueDate: new Date().toISOString() })

      await task1.save()
      await task2.save()

      const tasks = await Task.findAll()
      expect(tasks).toHaveLength(2)
      expect(tasks[0]).toBeInstanceOf(Task)
    })

    it("should find task by ID", async () => {
      const originalTask = new Task({ title: "Test Task", dueDate: new Date().toISOString() })
      await originalTask.save()

      const foundTask = await Task.findById(originalTask.id)
      expect(foundTask).toBeInstanceOf(Task)
      expect(foundTask.title).toBe(originalTask.title)
    })

    it("should return null for non-existent task", async () => {
      const task = await Task.findById("non-existent-id")
      expect(task).toBeNull()
    })
  })

  describe("Task Update", () => {
    it("should update task properties", async () => {
      const task = new Task({ title: "Original Title", dueDate: new Date().toISOString() })
      await task.save()
      const originalUpdatedAt = task.updatedAt

      // Wait a bit to ensure updatedAt changes
      await new Promise((resolve) => setTimeout(resolve, 10))

      task.title = "Updated Title"
      task.status = "completed"
      await task.save()

      expect(task.title).toBe("Updated Title")
      expect(task.status).toBe("completed")
      expect(task.updatedAt).not.toBe(originalUpdatedAt)
    })
  })

  describe("Task Deletion", () => {
    it("should delete task by ID", async () => {
      const task = new Task({ title: "To Delete", dueDate: new Date().toISOString() })
      await task.save()

      const deleted = await Task.deleteById(task.id)
      expect(deleted).toBe(true)

      const foundTask = await Task.findById(task.id)
      expect(foundTask).toBeNull()
    })

    it("should return false when deleting non-existent task", async () => {
      const deleted = await Task.deleteById("non-existent-id")
      expect(deleted).toBe(false)
    })
  })

  describe("Task Serialization", () => {
    it("should serialize to JSON correctly", () => {
      const taskData = {
        title: "Test Task",
        description: "Test Description",
        status: "in-progress",
        dueDate: "2024-12-31T10:00:00.000Z",
      }

      const task = new Task(taskData)
      const json = task.toJSON()

      expect(json).toHaveProperty("id")
      expect(json).toHaveProperty("title", taskData.title)
      expect(json).toHaveProperty("description", taskData.description)
      expect(json).toHaveProperty("status", taskData.status)
      expect(json).toHaveProperty("dueDate", taskData.dueDate)
      expect(json).toHaveProperty("createdAt")
      expect(json).toHaveProperty("updatedAt")
    })
  })
})
