// API Configuration
// Change this to your backend URL
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api'

// API Endpoints
export const API_ENDPOINTS = {
  // Auth endpoints
  LOGIN: '/auth/login',
  LOGOUT: '/auth/logout',
  
  // Task endpoints
  TASKS: '/tasks',
  TASK_BY_ID: (id) => `/tasks/${id}`,
  
  // User endpoints
  USERS: '/users',
  TEAM_MEMBERS: '/users/team-members',
  
  // Email endpoints
  SEND_EMAIL: '/email/send',
}