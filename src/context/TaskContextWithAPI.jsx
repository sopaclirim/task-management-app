import { createContext, useContext, useState, useEffect } from 'react'
import { authAPI, tasksAPI, usersAPI, emailAPI } from '../services/api'
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
  const [teamMembers, setTeamMembers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  
  // Team leader email (you can add this to a user object later)
  const teamLeaderEmail = 'leader@scantech.com'
  const teamLeaderName = 'Team Leader'

  // Load initial data from API
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        setLoading(true)
        
        // Check if user is already logged in (from localStorage)
        const savedUser = localStorage.getItem('currentUser')
        if (savedUser) {
          const user = JSON.parse(savedUser)
          setCurrentUser(user)
          
          // Load current user data from API
          try {
            const userData = await usersAPI.getCurrentUser()
            setCurrentUser(userData)
            localStorage.setItem('currentUser', JSON.stringify(userData))
          } catch (err) {
            console.error('Failed to load user from API:', err)
          }
        }
        
        // Load team members from API
        try {
          const members = await usersAPI.getTeamMembers()
          setTeamMembers(members)
        } catch (err) {
          console.error('Failed to load team members from API:', err)
          // Fallback to default team members if API fails
          setTeamMembers([
            { id: 1, name: 'Vesa Mexhuani', role: 'team_member', email: 'vesa@scantech.com' },
            { id: 2, name: 'Clirim Sopa', role: 'team_member', email: 'clirim@scantech.com' },
            { id: 3, name: 'Shkodran Sopa', role: 'team_member', email: 'shkodran@scantech.com' },
            { id: 4, name: 'Urim Canhasi', role: 'team_member', email: 'urim@scantech.com' },
          ])
        }
        
        // Load tasks from API
        try {
          const tasksData = await tasksAPI.getAll()
          setTasks(tasksData)
        } catch (err) {
          console.error('Failed to load tasks from API:', err)
          // Fallback to localStorage if API fails
          const savedTasks = localStorage.getItem('tasks')
          if (savedTasks) {
            setTasks(JSON.parse(savedTasks))
          }
        }
      } catch (err) {
        setError(err.message)
        console.error('Error loading initial data:', err)
      } finally {
        setLoading(false)
      }
    }
    
    loadInitialData()
  }, [])

  const login = async (email, password) => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await authAPI.login(email, password)
      
      // Set current user
      setCurrentUser(response.user)
      localStorage.setItem('currentUser', JSON.stringify(response.user))
      
      // Load team members after login
      try {
        const members = await usersAPI.getTeamMembers()
        setTeamMembers(members)
      } catch (err) {
        console.error('Failed to load team members:', err)
      }
      
      // Load tasks after login
      try {
        const tasksData = await tasksAPI.getAll()
        setTasks(tasksData)
      } catch (err) {
        console.error('Failed to load tasks:', err)
      }
      
      return response
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const logout = async () => {
    try {
      await authAPI.logout()
    } catch (err) {
      console.error('Logout error:', err)
    } finally {
      setCurrentUser(null)
      setTasks([])
      localStorage.removeItem('currentUser')
      localStorage.removeItem('authToken')
    }
  }

  const createTask = async (taskData) => {
    try {
      setError(null)
      
      // Create task via API
      const newTask = await tasksAPI.create(taskData)
      
      // Update local state
      setTasks((prev) => [...prev, newTask])
      
      // Send email notification to assigned member
      const assignee = teamMembers.find((m) => m.id === taskData.assigneeId)
      if (assignee) {
        try {
          await emailAPI.sendEmail(
            assignee.email,
            'New Task Assigned',
            `You have been assigned a new task: ${taskData.title}`
          )
        } catch (emailErr) {
          // Fallback to local email service if API fails
          await notifyTaskAssigned(
            assignee.email,
            assignee.name,
            taskData.title,
            taskData.description
          )
        }
      }
      
      return newTask
    } catch (err) {
      setError(err.message)
      throw err
    }
  }

  const updateTaskStatus = async (taskId, newStatus, previousStatus = null, comment = null) => {
    try {
      setError(null)
      
      // Update task status via API
      const updatedTask = await tasksAPI.updateStatus(taskId, newStatus, comment)
      
      // Update local state
      setTasks((prev) =>
        prev.map((t) => (t.id === taskId ? updatedTask : t))
      )

      const task = tasks.find((t) => t.id === taskId) || updatedTask

      // Send email notification when task is completed
      if (newStatus === 'completed' && previousStatus !== 'completed') {
        const assignee = teamMembers.find((m) => m.id === task.assigneeId)
        if (assignee) {
          try {
            await emailAPI.sendEmail(
              teamLeaderEmail,
              'Task Completed',
              `Task "${task.title}" has been completed by ${assignee.name}`
            )
          } catch (emailErr) {
            await notifyTaskCompleted(
              teamLeaderEmail,
              teamLeaderName,
              task.title,
              assignee.name
            )
          }
        }
      }

      // Send email notification when task is marked as problematic
      if (newStatus === 'problematic' && previousStatus !== 'problematic') {
        const assignee = teamMembers.find((m) => m.id === task.assigneeId)
        if (assignee) {
          try {
            await emailAPI.sendEmail(
              teamLeaderEmail,
              'Task Marked as Problematic',
              `Task "${task.title}" has been marked as problematic by ${assignee.name}`
            )
          } catch (emailErr) {
            await notifyTaskProblematic(
              teamLeaderEmail,
              teamLeaderName,
              task.title,
              assignee.name
            )
          }
        }
      }
    } catch (err) {
      setError(err.message)
      throw err
    }
  }

  const updateTaskAssignee = async (taskId, newAssigneeId) => {
    try {
      setError(null)
      
      // Update task assignee via API
      const updatedTask = await tasksAPI.updateAssignee(taskId, newAssigneeId)
      
      // Update local state
      setTasks((prev) =>
        prev.map((t) => (t.id === taskId ? updatedTask : t))
      )

      const task = tasks.find((t) => t.id === taskId) || updatedTask
      const previousAssignee = teamMembers.find((m) => m.id === task.assigneeId)
      const newAssignee = teamMembers.find((m) => m.id === newAssigneeId)

      // Send email notification to new assignee
      if (newAssignee && previousAssignee) {
        try {
          await emailAPI.sendEmail(
            newAssignee.email,
            'Task Reassigned',
            `Task "${task.title}" has been reassigned to you from ${previousAssignee.name}`
          )
        } catch (emailErr) {
          await notifyTaskReassigned(
            newAssignee.email,
            newAssignee.name,
            task.title,
            previousAssignee.name
          )
        }
      }
    } catch (err) {
      setError(err.message)
      throw err
    }
  }

  const updateTask = async (taskId, updatedFields) => {
    try {
      setError(null)
      
      // Update task via API
      const updatedTask = await tasksAPI.update(taskId, updatedFields)
      
      // Update local state
      setTasks((prev) =>
        prev.map((t) => (t.id === taskId ? updatedTask : t))
      )
    } catch (err) {
      setError(err.message)
      throw err
    }
  }

  const deleteTask = async (taskId) => {
    try {
      setError(null)
      
      // Delete task via API
      await tasksAPI.delete(taskId)
      
      // Update local state
      setTasks((prev) => prev.filter((task) => task.id !== taskId))
    } catch (err) {
      setError(err.message)
      throw err
    }
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
    loading,
    error,
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

