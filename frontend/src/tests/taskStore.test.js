import { renderHook, act } from "@testing-library/react"
import { useTaskStore } from "../store/taskStore"
import { taskApi } from "../services/api"
import jest from "jest" // Import jest to declare the variable

// Mock the API
jest.mock("../services/api")
jest.mock("react-hot-toast", () => ({
  success: jest.fn(),
  error: jest.fn(),
}))

const mockTasks = [
  {
    id: "1",
    title: "Task 1",
    description: "Description 1",
    status: "pending",
    dueDate: "2024-12-31T10:00:00.000Z",
    createdAt: "2024-01-01T10:00:00.000Z",
    updatedAt: "2024-01-01T10:00:00.000Z",
  },
  {
    id: "2",
    title: "Task 2",
    description: "Description 2",
    status: "completed",
    dueDate: "2024-12-30T10:00:00.000Z",
    createdAt: "2024-01-02T10:00:00.000Z",
    updatedAt: "2024-01-02T10:00:00.000Z",
  },
]

describe("useTaskStore", () => {
  beforeEach(() => {
    // Reset store state
    useTaskStore.setState({
      tasks: [],
      currentTask: null,
      loading: false,
      error: null,
      filters: {
        status: "all",
        sortBy: "dueDate",
        sortOrder: "asc",
      },
    })

    jest.clearAllMocks()
  })

  it("fetches tasks successfully", async () => {
    taskApi.getAllTasks.mockResolvedValue({ data: mockTasks })

    const { result } = renderHook(() => useTaskStore())

    await act(async () => {
      await result.current.fetchTasks()
    })

    expect(result.current.tasks).toEqual(mockTasks)
    expect(result.current.loading).toBe(false)
    expect(result.current.error).toBe(null)
  })

  it("handles fetch tasks error", async () => {
    const errorMessage = "Failed to fetch tasks"
    taskApi.getAllTasks.mockRejectedValue(new Error(errorMessage))

    const { result } = renderHook(() => useTaskStore())

    await act(async () => {
      await result.current.fetchTasks()
    })

    expect(result.current.tasks).toEqual([])
    expect(result.current.loading).toBe(false)
    expect(result.current.error).toBe(errorMessage)
  })

  it("creates task successfully", async () => {
    const newTask = { ...mockTasks[0], id: "3", title: "New Task" }
    taskApi.createTask.mockResolvedValue({ data: newTask })

    const { result } = renderHook(() => useTaskStore())

    await act(async () => {
      await result.current.createTask({ title: "New Task", dueDate: "2024-12-31T10:00:00.000Z" })
    })

    expect(result.current.tasks).toContain(newTask)
    expect(result.current.loading).toBe(false)
  })

  it("filters tasks by status", () => {
    const { result } = renderHook(() => useTaskStore())

    act(() => {
      useTaskStore.setState({ tasks: mockTasks })
      result.current.setFilters({ status: "completed" })
    })

    const filteredTasks = result.current.getFilteredTasks()
    expect(filteredTasks).toHaveLength(1)
    expect(filteredTasks[0].status).toBe("completed")
  })

  it("calculates task statistics correctly", () => {
    const { result } = renderHook(() => useTaskStore())

    act(() => {
      useTaskStore.setState({ tasks: mockTasks })
    })

    const stats = result.current.getTaskStats()
    expect(stats.total).toBe(2)
    expect(stats.pending).toBe(1)
    expect(stats.completed).toBe(1)
  })
})
