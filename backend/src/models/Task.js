const { v4: uuidv4 } = require("uuid")
const { getDatabase } = require("../database/db")

class Task {
  constructor(data) {
    this.id = data.id || uuidv4()
    this.title = data.title
    this.description = data.description || ""
    this.status = data.status || "pending"
    this.dueDate = data.dueDate || data.due_date
    this.createdAt = data.createdAt || data.created_at || new Date().toISOString()
    this.updatedAt = data.updatedAt || data.updated_at || new Date().toISOString()
  }

  static async findAll() {
    const db = getDatabase()
    return new Promise((resolve, reject) => {
      db.all("SELECT * FROM tasks ORDER BY created_at DESC", (err, rows) => {
        if (err) {
          reject(err)
          return
        }
        const tasks = rows.map((row) => new Task(row))
        resolve(tasks)
      })
    })
  }

  static async findById(id) {
    const db = getDatabase()
    return new Promise((resolve, reject) => {
      db.get("SELECT * FROM tasks WHERE id = ?", [id], (err, row) => {
        if (err) {
          reject(err)
          return
        }
        if (!row) {
          resolve(null)
          return
        }
        resolve(new Task(row))
      })
    })
  }

  async save() {
    const db = getDatabase()
    this.updatedAt = new Date().toISOString()

    return new Promise((resolve, reject) => {
      db.run(
        `
        INSERT OR REPLACE INTO tasks 
        (id, title, description, status, due_date, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `,
        [this.id, this.title, this.description, this.status, this.dueDate, this.createdAt, this.updatedAt],
        function (err) {
          if (err) {
            reject(err)
            return
          }
          resolve(this)
        },
      )
    })
  }

  static async deleteById(id) {
    const db = getDatabase()
    return new Promise((resolve, reject) => {
      db.run("DELETE FROM tasks WHERE id = ?", [id], function (err) {
        if (err) {
          reject(err)
          return
        }
        resolve(this.changes > 0)
      })
    })
  }

  toJSON() {
    return {
      id: this.id,
      title: this.title,
      description: this.description,
      status: this.status,
      dueDate: this.dueDate,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    }
  }
}

module.exports = Task
