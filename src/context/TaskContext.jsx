import { createContext, useContext, useState, useEffect } from 'react'
import { notifyTaskAssigned, notifyTaskCompleted, notifyTaskReassigned, notifyTaskProblematic } from '../services/emailService'

const TaskContext = createContext()

export const useTasks = () => {
  const context = useContext(TaskContext)
  if (!context) {
    throw new Error('useTasks must be used within a TaskProvider')
  }
  return context
}

export const TaskProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null)
  const [tasks, setTasks] = useState([])
  const [teamMembers, setTeamMembers] = useState([
    { id: 1, name: 'Vesa Mexhuani', role: 'team_member', email: 'vesa@scantech.com' },
    { id: 2, name: 'Clirim Sopa', role: 'team_member', email: 'clirim@scantech.com' },
    { id: 3, name: 'Shkodran Sopa', role: 'team_member', email: 'shkodran@scantech.com' },
    { id: 4, name: 'Urim Canhasi', role: 'team_member', email: 'urim@scantech.com' },
  ])
  
  // Team leader email (you can add this to a user object later)
  const teamLeaderEmail = 'leader@scantech.com'
  const teamLeaderName = 'Team Leader'

  // Load data from localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('currentUser')
    const savedTasks = localStorage.getItem('tasks')
    
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser))
    }
    if (savedTasks) {
      setTasks(JSON.parse(savedTasks))
    }
  }, [])

  // Save tasks to localStorage whenever they change
  useEffect(() => {
    if (tasks.length > 0 || localStorage.getItem('tasks')) {
      localStorage.setItem('tasks', JSON.stringify(tasks))
    }
  }, [tasks])

  const login = (user) => {
    setCurrentUser(user)
    localStorage.setItem('currentUser', JSON.stringify(user))
  }

  const logout = () => {
    setCurrentUser(null)
    localStorage.removeItem('currentUser')
  }

  const createTask = async (taskData) => {
    const newTask = {
      id: Date.now(),
      ...taskData,
      status: 'not_started',
      createdAt: new Date().toISOString(),
    }
    setTasks((prev) => [...prev, newTask])
    
    // Send email notification to assigned member
    const assignee = teamMembers.find((m) => m.id === taskData.assigneeId)
    if (assignee) {
      await notifyTaskAssigned(
        assignee.email,
        assignee.name,
        taskData.title,
        taskData.description
      )
    }
    
    return newTask
  }

  const updateTaskStatus = async (taskId, newStatus, previousStatus = null, comment = null) => {
    const task = tasks.find((t) => t.id === taskId)
    if (!task) return

    const updateData = { status: newStatus }
    if (comment) {
      updateData.problematicComment = comment
    }

    setTasks((prev) =>
      prev.map((t) =>
        t.id === taskId ? { ...t, ...updateData } : t
      )
    )

    // Send email notification when task is completed
    if (newStatus === 'completed' && previousStatus !== 'completed') {
      const assignee = teamMembers.find((m) => m.id === task.assigneeId)
      if (assignee) {
        await notifyTaskCompleted(
          teamLeaderEmail,
          teamLeaderName,
          task.title,
          assignee.name
        )
      }
    }

    // Send email notification when task is marked as problematic
    if (newStatus === 'problematic' && previousStatus !== 'problematic') {
      const assignee = teamMembers.find((m) => m.id === task.assigneeId)
      if (assignee) {
        await notifyTaskProblematic(
          teamLeaderEmail,
          teamLeaderName,
          task.title,
          assignee.name
        )
      }
    }
  }

  const updateTaskAssignee = async (taskId, newAssigneeId) => {
    const task = tasks.find((t) => t.id === taskId)
    if (!task) return

    const previousAssignee = teamMembers.find((m) => m.id === task.assigneeId)
    const newAssignee = teamMembers.find((m) => m.id === newAssigneeId)

    setTasks((prev) =>
      prev.map((t) =>
        t.id === taskId ? { ...t, assigneeId: newAssigneeId } : t
      )
    )

    // Send email notification to new assignee
    if (newAssignee && previousAssignee) {
      await notifyTaskReassigned(
        newAssignee.email,
        newAssignee.name,
        task.title,
        previousAssignee.name
      )
    }
  }

  const updateTask = (taskId, updatedFields) => {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === taskId ? { ...t, ...updatedFields } : t
      )
    )
  }

  const deleteTask = (taskId) => {
    setTasks((prev) => prev.filter((task) => task.id !== taskId))
  }

  const getTasksByAssignee = (userId) => {
    return tasks.filter((task) => task.assigneeId === userId)
  }

  const getTasksByStatus = (status) => {
    return tasks.filter((task) => task.status === status)
  }

  const value = {
    currentUser,
    tasks,
    teamMembers,
    login,
    logout,
    createTask,
    updateTaskStatus,
    updateTaskAssignee,
    updateTask,
    deleteTask,
    getTasksByAssignee,
    getTasksByStatus,
  }

  return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>
}


