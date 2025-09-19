import { create } from "zustand"
import { devtools } from "zustand/middleware"
import { taskApi } from "../services/api"
import toast from "react-hot-toast"

const useTaskStore = create(
  devtools(
    (set, get) => ({
      // State
      tasks: [],
      currentTask: null,
      loading: false,
      error: null,
      filters: {
        status: "all",
        sortBy: "dueDate",
        sortOrder: "asc",
      },

      // Actions
      setLoading: (loading) => set({ loading }),
      setError: (error) => set({ error }),
      clearError: () => set({ error: null }),

      // Fetch all tasks
      fetchTasks: async () => {
        set({ loading: true, error: null })
        try {
          const response = await taskApi.getAllTasks()
          set({ tasks: response.data, loading: false })
        } catch (error) {
          set({
            error: error.message || "Failed to fetch tasks",
            loading: false,
          })
          toast.error("Failed to fetch tasks")
        }
      },

      // Fetch single task
      fetchTask: async (id) => {
        set({ loading: true, error: null })
        try {
          const response = await taskApi.getTask(id)
          set({ currentTask: response.data, loading: false })
          return response.data
        } catch (error) {
          set({
            error: error.message || "Failed to fetch task",
            loading: false,
          })
          toast.error("Failed to fetch task")
          throw error
        }
      },

      // Create new task
      createTask: async (taskData) => {
        set({ loading: true, error: null })
        try {
          const response = await taskApi.createTask(taskData)
          const newTask = response.data

          set((state) => ({
            tasks: [newTask, ...state.tasks],
            loading: false,
          }))

          toast.success("Task created successfully")
          return newTask
        } catch (error) {
          set({
            error: error.message || "Failed to create task",
            loading: false,
          })
          toast.error("Failed to create task")
          throw error
        }
      },

      // Update task
      updateTask: async (id, taskData) => {
        set({ loading: true, error: null })
        try {
          const response = await taskApi.updateTask(id, taskData)
          const updatedTask = response.data

          set((state) => ({
            tasks: state.tasks.map((task) => (task.id === id ? updatedTask : task)),
            currentTask: state.currentTask?.id === id ? updatedTask : state.currentTask,
            loading: false,
          }))

          toast.success("Task updated successfully")
          return updatedTask
        } catch (error) {
          set({
            error: error.message || "Failed to update task",
            loading: false,
          })
          toast.error("Failed to update task")
          throw error
        }
      },

      // Update task status only
      updateTaskStatus: async (id, status) => {
        try {
          const response = await taskApi.updateTaskStatus(id, status)
          const updatedTask = response.data

          set((state) => ({
            tasks: state.tasks.map((task) => (task.id === id ? updatedTask : task)),
            currentTask: state.currentTask?.id === id ? updatedTask : state.currentTask,
          }))

          toast.success(`Task marked as ${status}`)
          return updatedTask
        } catch (error) {
          toast.error("Failed to update task status")
          throw error
        }
      },

      // Delete task
      deleteTask: async (id) => {
        try {
          await taskApi.deleteTask(id)

          set((state) => ({
            tasks: state.tasks.filter((task) => task.id !== id),
            currentTask: state.currentTask?.id === id ? null : state.currentTask,
          }))

          toast.success("Task deleted successfully")
        } catch (error) {
          toast.error("Failed to delete task")
          throw error
        }
      },

      // Filter and sort tasks
      setFilters: (filters) =>
        set((state) => ({
          filters: { ...state.filters, ...filters },
        })),

      // Get filtered and sorted tasks
      getFilteredTasks: () => {
        const { tasks, filters } = get()
        let filteredTasks = [...tasks]

        // Filter by status
        if (filters.status !== "all") {
          filteredTasks = filteredTasks.filter((task) => task.status === filters.status)
        }

        // Sort tasks
        filteredTasks.sort((a, b) => {
          let aValue, bValue

          switch (filters.sortBy) {
            case "title":
              aValue = a.title.toLowerCase()
              bValue = b.title.toLowerCase()
              break
            case "status":
              aValue = a.status
              bValue = b.status
              break
            case "createdAt":
              aValue = new Date(a.createdAt)
              bValue = new Date(b.createdAt)
              break
            case "dueDate":
            default:
              aValue = new Date(a.dueDate)
              bValue = new Date(b.dueDate)
              break
          }

          if (filters.sortOrder === "desc") {
            return aValue > bValue ? -1 : aValue < bValue ? 1 : 0
          } else {
            return aValue < bValue ? -1 : aValue > bValue ? 1 : 0
          }
        })

        return filteredTasks
      },

      // Get task statistics
      getTaskStats: () => {
        const { tasks } = get()
        return {
          total: tasks.length,
          pending: tasks.filter((task) => task.status === "pending").length,
          inProgress: tasks.filter((task) => task.status === "in-progress").length,
          completed: tasks.filter((task) => task.status === "completed").length,
          overdue: tasks.filter((task) => new Date(task.dueDate) < new Date() && task.status !== "completed").length,
        }
      },

      // Clear current task
      clearCurrentTask: () => set({ currentTask: null }),
    }),
    {
      name: "task-store",
    },
  ),
)

export { useTaskStore }
