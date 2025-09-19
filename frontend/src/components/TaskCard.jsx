"use client"
import { Link } from "react-router-dom"
import { format } from "date-fns"
import { Calendar, Clock, Edit, Trash2 } from "lucide-react"
import { useTaskStore } from "../store/taskStore"

const TaskCard = ({ task }) => {
  const { deleteTask } = useTaskStore()

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

  const handleDelete = async (e) => {
    e.preventDefault()
    e.stopPropagation()

    if (window.confirm("Are you sure you want to delete this task?")) {
      await deleteTask(task.id)
    }
  }

  const isOverdue = new Date(task.dueDate) < new Date() && task.status !== "completed"

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
      <Link to={`/tasks/${task.id}`} className="block p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-medium text-gray-900 truncate">{task.title}</h3>

            {task.description && <p className="mt-1 text-sm text-gray-600 line-clamp-2">{task.description}</p>}

            <div className="mt-3 flex items-center space-x-4 text-sm text-gray-500">
              <div className="flex items-center space-x-1">
                <Calendar className="w-4 h-4" />
                <span>Due: {format(new Date(task.dueDate), "MMM dd, yyyy")}</span>
                {isOverdue && <span className="text-red-600 font-medium">(Overdue)</span>}
              </div>

              <div className="flex items-center space-x-1">
                <Clock className="w-4 h-4" />
                <span>Created: {format(new Date(task.createdAt), "MMM dd, yyyy")}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2 ml-4">
            <span
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(task.status)}`}
            >
              {getStatusText(task.status)}
            </span>
          </div>
        </div>
      </Link>

      <div className="px-6 py-3 bg-gray-50 border-t border-gray-200 flex justify-end space-x-2">
        <Link
          to={`/tasks/${task.id}/edit`}
          className="inline-flex items-center space-x-1 text-sm text-gray-600 hover:text-primary-600 transition-colors"
        >
          <Edit className="w-4 h-4" />
          <span>Edit</span>
        </Link>

        <button
          onClick={handleDelete}
          className="inline-flex items-center space-x-1 text-sm text-gray-600 hover:text-red-600 transition-colors"
        >
          <Trash2 className="w-4 h-4" />
          <span>Delete</span>
        </button>
      </div>
    </div>
  )
}

export default TaskCard
