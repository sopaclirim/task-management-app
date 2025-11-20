import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTasks } from '../context/TaskContext'
import { FaTrash, FaUser, FaFlag, FaCalendarAlt, FaExclamationTriangle, FaExchangeAlt } from 'react-icons/fa'
import './TaskItem.css'

const TaskItem = ({ task }) => {
  const navigate = useNavigate()
  const { updateTaskStatus, updateTaskAssignee, deleteTask, teamMembers, currentUser } = useTasks()
  const isTeamLeader = currentUser?.role === 'team_leader'
  const isAssignedToMe = currentUser?.id === task.assigneeId
  const [showReassign, setShowReassign] = useState(false)
  const [newAssigneeId, setNewAssigneeId] = useState('')

  const assignee = teamMembers.find((m) => m.id === task.assigneeId)
  const assigneeName = assignee ? assignee.name : 'Unknown'

  const handleStatusChange = async (newStatus) => {
    const previousStatus = task.status
    await updateTaskStatus(task.id, newStatus, previousStatus)
  }

  const handleMarkAsProblematic = async () => {
    if (window.confirm('Mark this task as problematic? The team leader will be notified.')) {
      await updateTaskStatus(task.id, 'problematic', task.status)
    }
  }

  const handleReassign = async () => {
    if (!newAssigneeId) {
      alert('Please select a team member')
      return
    }
    
    if (window.confirm(`Reassign this task to ${teamMembers.find(m => m.id === parseInt(newAssigneeId))?.name}?`)) {
      await updateTaskAssignee(task.id, parseInt(newAssigneeId))
      setShowReassign(false)
      setNewAssigneeId('')
    }
  }

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      deleteTask(task.id)
    }
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return '#f87171'
      case 'medium':
        return '#ffc107'
      case 'low':
        return '#198754'
      default:
        return '#6b7280'
    }
  }

  const getPriorityLabel = (priority) => {
    switch (priority) {
      case 'high':
        return 'High'
      case 'medium':
        return 'Medium'
      case 'low':
        return 'Low'
      default:
        return 'Unknown'
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return null
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  const handleTaskClick = (e) => {
    // Don't navigate if clicking on buttons or selects
    if (e.target.closest('button') || e.target.closest('select')) {
      return
    }
    navigate(`/dashboard/task/${task.id}`)
  }

  return (
    <div 
      className={`task-item ${isAssignedToMe ? 'assigned-to-me' : ''}`}
      onClick={handleTaskClick}
    >
      {isAssignedToMe && (
        <div className="assigned-badge">Assigned to you</div>
      )}
      <div className="task-header">
        <h4 className="task-title">{task.title}</h4>
        {isTeamLeader && (
          <button 
            onClick={(e) => {
              e.stopPropagation()
              handleDelete()
            }} 
            className="delete-button" 
            title="Delete"
          >
            <FaTrash />
          </button>
        )}
      </div>

      <div className="task-meta-simple">
        <div className="task-info-row">
          <span className="task-label">
            <FaUser style={{ marginRight: '6px', fontSize: '12px' }} />
            Assigned To:
          </span>
          <span className="task-value">{assigneeName}</span>
        </div>
      </div>
    </div>
  )
}

export default TaskItem

