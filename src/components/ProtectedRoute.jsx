import { Navigate } from 'react-router-dom'
import { useTasks } from '../context/TaskContext'

const ProtectedRoute = ({ children }) => {
  const { currentUser } = useTasks()

  if (!currentUser) {
    return <Navigate to="/login" replace />
  }

  return children
}

export default ProtectedRoute

