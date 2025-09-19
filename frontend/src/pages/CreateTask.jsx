"use client"
import { useNavigate } from "react-router-dom"
import { ArrowLeft } from "lucide-react"
import TaskForm from "../components/TaskForm"
import { useTaskStore } from "../store/taskStore"

const CreateTask = () => {
  const navigate = useNavigate()
  const { createTask, loading } = useTaskStore()

  const handleSubmit = async (taskData) => {
    try {
      const newTask = await createTask(taskData)
      navigate(`/tasks/${newTask.id}`)
    } catch (error) {
      // Error is handled by the store and toast
      console.error("Failed to create task:", error)
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={() => navigate("/")}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Tasks</span>
        </button>

        <h1 className="text-2xl font-bold text-gray-900">Create New Task</h1>
        <p className="text-gray-600 mt-1">Add a new task to your casework management system</p>
      </div>

      {/* Form */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <TaskForm onSubmit={handleSubmit} isLoading={loading} />
      </div>
    </div>
  )
}

export default CreateTask
