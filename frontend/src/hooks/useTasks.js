import { useEffect, useCallback } from "react"
import { useTaskStore } from "../store/taskStore"

// Hook to manage multiple tasks
export const useTasks = () => {
  const {
    tasks,
    loading,
    error,
    filters,
    fetchTasks,
    getFilteredTasks,
    getTaskStats,
    setFilters,
    clearError,
  } = useTaskStore()

  // Memoize fetchTasks to avoid unnecessary re-renders
  const refetch = useCallback(() => {
    fetchTasks()
  }, [fetchTasks])

  useEffect(() => {
    refetch()
  }, [refetch])

  const filteredTasks = getFilteredTasks()
  const stats = getTaskStats()

  return {
    tasks: filteredTasks,
    allTasks: tasks,
    loading,
    error,
    filters,
    stats,
    setFilters,
    clearError,
    refetch,
  }
}

// Hook to manage a single task by ID
export const useTask = (id) => {
  const {
    currentTask,
    loading,
    error,
    fetchTask,
    clearCurrentTask,
    clearError,
  } = useTaskStore()

  const refetch = useCallback(() => {
    if (id) fetchTask(id)
  }, [id, fetchTask])

  useEffect(() => {
    if (id) fetchTask(id)

    return () => {
      clearCurrentTask()
    }
  }, [id, fetchTask, clearCurrentTask])

  return {
    task: currentTask,
    loading,
    error,
    clearError,
    refetch,
  }
}
