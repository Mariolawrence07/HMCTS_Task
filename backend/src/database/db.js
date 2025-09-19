const sqlite3 = require("sqlite3").verbose()
const path = require("path")

const DB_PATH = path.join(__dirname, "../../data/tasks.db")

let db

const initializeDatabase = () => {
  return new Promise((resolve, reject) => {
    // Create data directory if it doesn't exist
    const fs = require("fs")
    const dataDir = path.dirname(DB_PATH)
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true })
    }

    db = new sqlite3.Database(DB_PATH, (err) => {
      if (err) {
        console.error("Error opening database:", err)
        reject(err)
        return
      }
      console.log("📦 Connected to SQLite database")

      // Create tasks table
      db.run(
        `
        CREATE TABLE IF NOT EXISTS tasks (
          id TEXT PRIMARY KEY,
          title TEXT NOT NULL,
          description TEXT,
          status TEXT NOT NULL DEFAULT 'pending',
          due_date TEXT NOT NULL,
          created_at TEXT NOT NULL,
          updated_at TEXT NOT NULL
        )
      `,
        (err) => {
          if (err) {
            console.error("Error creating tasks table:", err)
            reject(err)
            return
          }
          console.log("✅ Tasks table ready")
          resolve()
        },
      )
    })
  })
}

const getDatabase = () => {
  if (!db) {
    throw new Error("Database not initialized. Call initializeDatabase() first.")
  }
  return db
}

const closeDatabase = () => {
  return new Promise((resolve) => {
    if (db) {
      db.close((err) => {
        if (err) {
          console.error("Error closing database:", err)
        } else {
          console.log("📦 Database connection closed")
        }
        resolve()
      })
    } else {
      resolve()
    }
  })
}

module.exports = {
  initializeDatabase,
  getDatabase,
  closeDatabase,
}
