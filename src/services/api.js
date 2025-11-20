import { API_BASE_URL, API_ENDPOINTS } from '../config/api'

// Helper function to handle API responses
const handleResponse = async (response) => {
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'An error occurred' }))
    throw new Error(error.message || `HTTP error! status: ${response.status}`)
  }
  return response.json()
}

// Helper function to get auth token from localStorage
const getAuthToken = () => {
  return localStorage.getItem('authToken')
}

// Helper function to get headers with auth token
const getHeaders = (includeAuth = true) => {
  const headers = {
    'Content-Type': 'application/json',
  }
  
  if (includeAuth) {
    const token = getAuthToken()
    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }
  }
  
  return headers
}

// Auth API calls
export const authAPI = {
  login: async (email, password) => {
    const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.LOGIN}`, {
      method: 'POST',
      headers: getHeaders(false),
      body: JSON.stringify({ email, password }),
    })
    
    const data = await handleResponse(response)
    
    // Store token if provided
    if (data.token) {
      localStorage.setItem('authToken', data.token)
    }
    
    return data
  },
  
  logout: async () => {
    try {
      await fetch(`${API_BASE_URL}${API_ENDPOINTS.LOGOUT}`, {
        method: 'POST',
        headers: getHeaders(),
      })
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      localStorage.removeItem('authToken')
    }
  },
}

// Tasks API calls
export const tasksAPI = {
  // Get all tasks
  getAll: async () => {
    const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.TASKS}`, {
      method: 'GET',
      headers: getHeaders(),
    })
    return handleResponse(response)
  },
  
  // Get task by ID
  getById: async (id) => {
    const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.TASK_BY_ID(id)}`, {
      method: 'GET',
      headers: getHeaders(),
    })
    return handleResponse(response)
  },
  
  // Create new task
  create: async (taskData) => {
    const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.TASKS}`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(taskData),
    })
    return handleResponse(response)
  },
  
  // Update task
  update: async (id, updatedFields) => {
    const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.TASK_BY_ID(id)}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(updatedFields),
    })
    return handleResponse(response)
  },
  
  // Update task status
  updateStatus: async (id, status, comment = null) => {
    const body = { status }
    if (comment) {
      body.comment = comment
    }
    
    const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.TASK_BY_ID(id)}/status`, {
      method: 'PATCH',
      headers: getHeaders(),
      body: JSON.stringify(body),
    })
    return handleResponse(response)
  },
  
  // Update task assignee
  updateAssignee: async (id, assigneeId) => {
    const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.TASK_BY_ID(id)}/assignee`, {
      method: 'PATCH',
      headers: getHeaders(),
      body: JSON.stringify({ assigneeId }),
    })
    return handleResponse(response)
  },
  
  // Delete task
  delete: async (id) => {
    const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.TASK_BY_ID(id)}`, {
      method: 'DELETE',
      headers: getHeaders(),
    })
    return handleResponse(response)
  },
}

// Users API calls
export const usersAPI = {
  // Get all team members
  getTeamMembers: async () => {
    const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.TEAM_MEMBERS}`, {
      method: 'GET',
      headers: getHeaders(),
    })
    return handleResponse(response)
  },
  
  // Get current user
  getCurrentUser: async () => {
    const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.USERS}/me`, {
      method: 'GET',
      headers: getHeaders(),
    })
    return handleResponse(response)
  },
}

// Email API calls
export const emailAPI = {
  sendEmail: async (to, subject, message) => {
    const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.SEND_EMAIL}`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ to, subject, message }),
    })
    return handleResponse(response)
  },
}

