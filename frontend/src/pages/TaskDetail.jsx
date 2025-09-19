"use client"
import { useParams, useNavigate, Link } from "react-router-dom"
import { format } from "date-fns"
import { ArrowLeft, Edit, Trash2, Calendar, Clock } from "lucide-react"
import LoadingSpinner from "../components/LoadingSpinner"
import { useTask } from "../hooks/useTasks"
import { useTaskStore } from "../store/taskStore"

const TaskDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { task, loading, error } = useTask(id)
  const { deleteTask, updateTaskStatus } = useTaskStore()

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      try {
        await deleteTask(id)
        navigate("/")
      } catch (error) {
        console.error("Failed to delete task:", error)
      }
    }
  }

  const handleStatusChange = async (newStatus) => {
    try {
      await updateTaskStatus(id, newStatus)
    } catch (error) {
      console.error("Failed to update status:", error)
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800"
      case "in-progress":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusText = (status) => {
    switch (status) {
      case "completed":
        return "Completed"
      case "in-progress":
        return "In Progress"
      default:
        return "Pending"
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <h3 className="text-sm font-medium text-red-800">Error</h3>
          <div className="mt-2 text-sm text-red-700">{error}</div>
          <div className="mt-3">
            <button onClick={() => navigate("/")} className="text-sm text-red-600 hover:text-red-500">
              Back to Tasks
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (!task) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="text-center py-12">
          <div className="text-gray-500 text-lg mb-4">Task not found</div>
          <button onClick={() => navigate("/")} className="btn-primary">
            Back to Tasks
          </button>
        </div>
      </div>
    )
  }

  const isOverdue = new Date(task.dueDate) < new Date() && task.status !== "completed"

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={() => navigate("/")}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Tasks</span>
        </button>
      </div>

      {/* Task Details */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">{task.title}</h1>
              <div className="flex items-center space-x-4">
                <span
                  className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(task.status)}`}
                >
                  {getStatusText(task.status)}
                </span>
                {isOverdue && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
                    Overdue
                  </span>
                )}
              </div>
            </div>

            <div className="flex items-center space-x-2 ml-4">
              <Link to={`/tasks/${id}/edit`} className="btn-secondary flex items-center space-x-2">
                <Edit className="w-4 h-4" />
                <span>Edit</span>
              </Link>

              <button onClick={handleDelete} className="btn-danger flex items-center space-x-2">
                <Trash2 className="w-4 h-4" />
                <span>Delete</span>
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="px-6 py-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Description */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-3">Description</h3>
                {task.description ? (
                  <div className="prose prose-sm max-w-none">
                    <p className="text-gray-700 whitespace-pre-wrap">{task.description}</p>
                  </div>
                ) : (
                  <p className="text-gray-500 italic">No description provided</p>
                )}
              </div>

              {/* Status Actions */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-3">Update Status</h3>
                <div className="flex space-x-2">
                  {["pending", "in-progress", "completed"].map((status) => (
                    <button
                      key={status}
                      onClick={() => handleStatusChange(status)}
                      disabled={task.status === status}
                      className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                        task.status === status
                          ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      Mark as {getStatusText(status)}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Task Info */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Task Information</h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <Calendar className="w-5 h-5 text-gray-400" />
                    <div>
                      <div className="text-sm font-medium text-gray-900">Due Date</div>
                      <div className={`text-sm ${isOverdue ? "text-red-600 font-medium" : "text-gray-600"}`}>
                        {format(new Date(task.dueDate), "PPP p")}
                        {isOverdue && " (Overdue)"}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <Clock className="w-5 h-5 text-gray-400" />
                    <div>
                      <div className="text-sm font-medium text-gray-900">Created</div>
                      <div className="text-sm text-gray-600">{format(new Date(task.createdAt), "PPP p")}</div>
                    </div>
                  </div>

                  {task.updatedAt !== task.createdAt && (
                    <div className="flex items-center space-x-3">
                      <Clock className="w-5 h-5 text-gray-400" />
                      <div>
                        <div className="text-sm font-medium text-gray-900">Last Updated</div>
                        <div className="text-sm text-gray-600">{format(new Date(task.updatedAt), "PPP p")}</div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TaskDetail
