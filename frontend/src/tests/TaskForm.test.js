import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import TaskForm from "../components/TaskForm"
import jest from "jest" // Import jest to fix the undeclared variable error

const mockOnSubmit = jest.fn()

const defaultProps = {
  onSubmit: mockOnSubmit,
  isLoading: false,
}

describe("TaskForm", () => {
  beforeEach(() => {
    mockOnSubmit.mockClear()
  })

  it("renders form fields correctly", () => {
    render(<TaskForm {...defaultProps} />)

    expect(screen.getByLabelText(/title/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/description/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/status/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/due date/i)).toBeInTheDocument()
    expect(screen.getByRole("button", { name: /create task/i })).toBeInTheDocument()
  })

  it("shows validation errors for empty required fields", async () => {
    const user = userEvent.setup()
    render(<TaskForm {...defaultProps} />)

    const submitButton = screen.getByRole("button", { name: /create task/i })
    await user.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText(/title is required/i)).toBeInTheDocument()
      expect(screen.getByText(/due date is required/i)).toBeInTheDocument()
    })

    expect(mockOnSubmit).not.toHaveBeenCalled()
  })

  it("submits form with valid data", async () => {
    const user = userEvent.setup()
    render(<TaskForm {...defaultProps} />)

    const titleInput = screen.getByLabelText(/title/i)
    const descriptionInput = screen.getByLabelText(/description/i)
    const dueDateInput = screen.getByLabelText(/due date/i)
    const submitButton = screen.getByRole("button", { name: /create task/i })

    await user.type(titleInput, "Test Task")
    await user.type(descriptionInput, "Test Description")
    await user.type(dueDateInput, "2024-12-31T10:00")
    await user.click(submitButton)

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({
        title: "Test Task",
        description: "Test Description",
        status: "pending",
        dueDate: expect.any(String),
      })
    })
  })

  it("populates form with existing task data", () => {
    const existingTask = {
      title: "Existing Task",
      description: "Existing Description",
      status: "in-progress",
      dueDate: "2024-12-31T10:00:00.000Z",
    }

    render(<TaskForm {...defaultProps} task={existingTask} />)

    expect(screen.getByDisplayValue("Existing Task")).toBeInTheDocument()
    expect(screen.getByDisplayValue("Existing Description")).toBeInTheDocument()
    expect(screen.getByDisplayValue("in-progress")).toBeInTheDocument()
    expect(screen.getByRole("button", { name: /update task/i })).toBeInTheDocument()
  })

  it("disables form when loading", () => {
    render(<TaskForm {...defaultProps} isLoading={true} />)

    const submitButton = screen.getByRole("button", { name: /saving/i })
    expect(submitButton).toBeDisabled()
  })
})
