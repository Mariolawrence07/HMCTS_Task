# HMCTS Task Management System

A monorepo containing a task management system for HMCTS caseworkers to efficiently manage their tasks.

## Project Structure


hmcts-task-manager-
backend-       Express.js API server
frontend-       React application with Zustand
package.json-      Root package.json with workspace configuration



## Features

### Backend API
- Create tasks with title, description, status, and due date
- Retrieve tasks by ID or get all tasks
- Update task status
- Delete tasks
- Input validation and error handling
- Unit tests
- Database storage

### Frontend Application
- User-friendly interface for task management
- Create, view, update, and delete tasks
- State management with Zustand
- Responsive design

## Tech Stack

- **Backend**: Node.js, Express.js, SQLite/PostgreSQL
- **Frontend**: React, Zustand, Tailwind CSS
- **Testing**: Jest, React Testing Library
- **Development**: Concurrently for running both servers

## Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm

### Installation

1. Clone the repository
bash
git clone 
cd DTS_Test


2. Install all dependencies
bash
npm run install:all


### Development

Run both backend and frontend in development mode:
bash
npm run dev


Or run them separately:
bash
# Backend only (runs on http://localhost:3001)
cd backend
npm i
npm run dev:backend

# Frontend only (runs on http://localhost:3000)
cd frontend
npm i
npm run dev:frontend


### Building

Build both applications:
bash
npm run build


### Testing

Run all tests:
bash
npm run test


## API Documentation

### Endpoints

- `GET /api/tasks` - Retrieve all tasks
- `GET /api/tasks/:id` - Retrieve a specific task
- `POST /api/tasks` - Create a new task
- `PUT /api/tasks/:id` - Update a task
- `DELETE /api/tasks/:id` - Delete a task

### Task Schema

json
{
  "id": "string",
  "title": "string (required)",
  "description": "string (optional)",
  "status": "pending | in-progress | completed",
  "dueDate": "ISO 8601 date string",
  "createdAt": "ISO 8601 date string",
  "updatedAt": "ISO 8601 date string"
}



