import React from 'react';


import { Routes, Route } from "react-router-dom"
import Layout from "./components/Layout"
import TaskList from "./pages/TaskList"
import CreateTask from "./pages/CreateTask"
import EditTask from "./pages/EditTask"
import TaskDetail from "./pages/TaskDetail"

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<TaskList />} />
        <Route path="/tasks/new" element={<CreateTask />} />
        <Route path="/tasks/:id" element={<TaskDetail />} />
        <Route path="/tasks/:id/edit" element={<EditTask />} />
      </Routes>
    </Layout>
  )
}

export default App
