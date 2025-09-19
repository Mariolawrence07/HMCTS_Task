const request = require("supertest")
const app = require("../server")
const { initializeDatabase, closeDatabase } = require("../database/db")

describe("Tasks API", () => {
  beforeAll(async () => {
    await initializeDatabase()
  })

  afterAll(async () => {
    await closeDatabase()
  })

  describe("GET /api/tasks", () => {
    it("should return all tasks", async () => {
      const response = await request(app).get("/api/tasks").expect(200)

      expect(response.body.success).toBe(true)
      expect(Array.isArray(response.body.data)).toBe(true)
    })
  })

  describe("POST /api/tasks", () => {
    it("should create a new task", async () => {
      const taskData = {
        title: "Test Task",
        description: "Test Description",
        status: "pending",
        dueDate: new Date().toISOString(),
      }

      const response = await request(app).post("/api/tasks").send(taskData).expect(201)

      expect(response.body.success).toBe(true)
      expect(response.body.data.title).toBe(taskData.title)
      expect(response.body.data.id).toBeDefined()
    })

    it("should return validation error for missing title", async () => {
      const taskData = {
        description: "Test Description",
        dueDate: new Date().toISOString(),
      }

      const response = await request(app).post("/api/tasks").send(taskData).expect(400)

      expect(response.body.success).toBe(false)
      expect(response.body.error).toBe("Validation failed")
    })
  })

  describe("GET /api/tasks/:id", () => {
    it("should return 404 for non-existent task", async () => {
      const fakeId = "123e4567-e89b-12d3-a456-426614174000"

      const response = await request(app).get(`/api/tasks/${fakeId}`).expect(404)

      expect(response.body.success).toBe(false)
      expect(response.body.error).toBe("Task not found")
    })
  })
})
