const errorHandler = (err, req, res, next) => {
  console.error("Error:", err)

  // Default error
  const error = {
    success: false,
    error: "Internal server error",
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  }

  // SQLite errors
  if (err.code === "SQLITE_CONSTRAINT") {
    error.error = "Database constraint violation"
    error.statusCode = 400
  }

  // Validation errors
  if (err.name === "ValidationError") {
    error.error = "Validation failed"
    error.details = err.details
    error.statusCode = 400
  }

  // Send error response
  const statusCode = error.statusCode || 500
  res.status(statusCode).json(error)
}

module.exports = { errorHandler }
