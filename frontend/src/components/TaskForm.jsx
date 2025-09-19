"use client"
import { useForm } from "react-hook-form"
import { format } from "date-fns"

const TaskForm = ({ task, onSubmit, isLoading = false }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: task?.title || "",
      description: task?.description || "",
      status: task?.status || "pending",
      dueDate: task?.dueDate ? format(new Date(task.dueDate), "yyyy-MM-dd'T'HH:mm") : "",
    },
  })

  const onFormSubmit = (data) => {
    onSubmit({
      ...data,
      dueDate: new Date(data.dueDate).toISOString(),
    })
  }

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
          Title *
        </label>
        <input
          type="text"
          id="title"
          className={`input ${errors.title ? "border-red-500" : ""}`}
          {...register("title", {
            required: "Title is required",
            maxLength: { value: 200, message: "Title must not exceed 200 characters" },
          })}
        />
        {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>}
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
          Description
        </label>
        <textarea
          id="description"
          rows={4}
          className={`textarea ${errors.description ? "border-red-500" : ""}`}
          {...register("description", {
            maxLength: { value: 1000, message: "Description must not exceed 1000 characters" },
          })}
        />
        {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>}
      </div>

      <div>
        <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
          Status
        </label>
        <select id="status" className="select" {...register("status")}>
          <option value="pending">Pending</option>
          <option value="in-progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>
      </div>

      <div>
        <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700 mb-2">
          Due Date *
        </label>
        <input
          type="datetime-local"
          id="dueDate"
          className={`input ${errors.dueDate ? "border-red-500" : ""}`}
          {...register("dueDate", {
            required: "Due date is required",
          })}
        />
        {errors.dueDate && <p className="mt-1 text-sm text-red-600">{errors.dueDate.message}</p>}
      </div>

      <div className="flex justify-end space-x-3">
        <button type="button" onClick={() => window.history.back()} className="btn-secondary" disabled={isLoading}>
          Cancel
        </button>
        <button type="submit" className="btn-primary" disabled={isLoading}>
          {isLoading ? "Saving..." : task ? "Update Task" : "Create Task"}
        </button>
      </div>
    </form>
  )
}

export default TaskForm
