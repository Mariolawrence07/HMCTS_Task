"use client"
import { useParams, useNavigate } from "react-router-dom"
import { ArrowLeft } from "lucide-react"
import TaskForm from "../components/TaskForm"
import LoadingSpinner from "../components/LoadingSpinner"
import { useTask } from "../hooks/useTasks"
import { useTaskStore } from "../store/taskStore"

const EditTask = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { task, loading: fetchLoading, error } = useTask(id)
  const { updateTask, loading: updateLoading } = useTaskStore()

  const handleSubmit = async (taskData) => {
    try {
      await updateTask(id, taskData)
      navigate(`/tasks/${id}`)
    } catch (error) {
      // Error is handled by the store and toast
      console.error("Failed to update task:", error)
    }
  }

  if (fetchLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto">
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
      <div className="max-w-2xl mx-auto">
        <div className="text-center py-12">
          <div className="text-gray-500 text-lg mb-4">Task not found</div>
          <button onClick={() => navigate("/")} className="btn-primary">
            Back to Tasks
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={() => navigate(`/tasks/${id}`)}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Task</span>
        </button>

        <h1 className="text-2xl font-bold text-gray-900">Edit Task</h1>
        <p className="text-gray-600 mt-1">Update the details of your task</p>
      </div>

      {/* Form */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <TaskForm task={task} onSubmit={handleSubmit} isLoading={updateLoading} />
      </div>
    </div>
  )
}

export default EditTask
