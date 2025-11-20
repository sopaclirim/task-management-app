import { useParams, useNavigate } from 'react-router-dom'
import { useTasks } from '../context/TaskContext'
import DashboardLayout from './DashboardLayout'
import { 
  FaArrowLeft, 
  FaUser, 
  FaFlag, 
  FaCalendarAlt, 
  FaTrash,
  FaExclamationTriangle,
  FaExchangeAlt,
  FaCheckCircle,
  FaClock,
  FaPauseCircle,
  FaEdit,
  FaSave,
  FaComment,
  FaPaperPlane,
  FaTimes
} from 'react-icons/fa'
import { useState, useEffect } from 'react'
import './TaskDetails.css'

const TaskDetails = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { tasks, teamMembers, currentUser, updateTaskStatus, updateTaskAssignee, updateTask, deleteTask, addTaskComment, updateTaskComment, deleteTaskComment } = useTasks()
  const task = tasks.find((t) => t.id === parseInt(id))
  const [showReassign, setShowReassign] = useState(false)
  const [newAssigneeId, setNewAssigneeId] = useState('')
  const [isEditing, setIsEditing] = useState(false)
  const [editedTitle, setEditedTitle] = useState('')
  const [editedDescription, setEditedDescription] = useState('')
  const [editedPriority, setEditedPriority] = useState('')
  const [editedDueDate, setEditedDueDate] = useState('')
  const [showProblematicModal, setShowProblematicModal] = useState(false)
  const [problematicComment, setProblematicComment] = useState('')
  const [newComment, setNewComment] = useState('')
  const [editingCommentId, setEditingCommentId] = useState(null)
  const [editingCommentText, setEditingCommentText] = useState('')

  const isTeamLeader = currentUser?.role === 'team_leader'
  const isAssignedToMe = currentUser?.id === task?.assigneeId

  // Initialize form values when task loads
  useEffect(() => {
    if (task) {
      setEditedTitle(task.title || '')
      setEditedDescription(task.description || '')
      setEditedPriority(task.priority || 'medium')
      setEditedDueDate(task.dueDate ? task.dueDate.split('T')[0] : '')
    }
  }, [task])

  const handleAddComment = (e) => {
    e.preventDefault()
    if (!newComment.trim()) return

    addTaskComment(
      task.id,
      newComment.trim(),
      currentUser.id,
      currentUser.name
    )
    setNewComment('')
  }

  const formatDateTime = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (!task) {
    return (
      <DashboardLayout>
        <div className="task-details-container">
          <div className="task-details">
            <p>Task not found</p>
            <button onClick={() => navigate('/dashboard')} className="back-button">
              <FaArrowLeft style={{ marginRight: '6px' }} />
              Back to Dashboard
            </button>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  const assignee = teamMembers.find((m) => m.id === task.assigneeId)
  const assigneeName = assignee ? assignee.name : 'Unknown'

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

  const getStatusInfo = (status) => {
    switch (status) {
      case 'not_started':
        return { label: 'Not Started', icon: <FaPauseCircle />, color: '#dc3545' }
      case 'in_progress':
        return { label: 'In Progress', icon: <FaClock />, color: '#ffc107' }
      case 'problematic':
        return { label: 'Problematic', icon: <FaExclamationTriangle />, color: '#ffc107' }
      case 'completed':
        return { label: 'Completed', icon: <FaCheckCircle />, color: '#198754' }
      default:
        return { label: 'Unknown', icon: <FaPauseCircle />, color: '#6b7280' }
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return null
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  const handleStatusChange = async (newStatus) => {
    const previousStatus = task.status
    await updateTaskStatus(task.id, newStatus, previousStatus)
  }

  const handleMarkAsProblematic = () => {
    setShowProblematicModal(true)
  }

  const handleSubmitProblematic = async () => {
    if (!problematicComment.trim()) {
      alert('Please provide a comment explaining why this task is problematic.')
      return
    }
    
    await updateTaskStatus(task.id, 'problematic', task.status, problematicComment.trim())
    setShowProblematicModal(false)
    setProblematicComment('')
    alert('Task marked as problematic. Team leader has been notified.')
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
      navigate('/dashboard')
    }
  }

  const handleSave = () => {
    if (!editedTitle.trim()) {
      alert('Task title is required!')
      return
    }

    const updatedFields = {
      title: editedTitle.trim(),
      description: editedDescription.trim(),
      priority: editedPriority,
      dueDate: editedDueDate || null,
    }

    updateTask(task.id, updatedFields)
    setIsEditing(false)
    alert('Task updated successfully!')
  }

  const handleCancel = () => {
    // Reset to original values
    setEditedTitle(task.title || '')
    setEditedDescription(task.description || '')
    setEditedPriority(task.priority || 'medium')
    setEditedDueDate(task.dueDate ? task.dueDate.split('T')[0] : '')
    setIsEditing(false)
  }

  const statusInfo = getStatusInfo(task.status)

  return (
    <DashboardLayout>
      <div className="task-details-container">
        <div className="task-details">
        <button onClick={() => navigate('/dashboard')} className="back-button">
          <FaArrowLeft style={{ marginRight: '6px' }} />
          Back to Dashboard
        </button>

        <div className="task-details-header">
          <div className="task-title-section">
            {isTeamLeader && isEditing ? (
              <input
                type="text"
                value={editedTitle}
                onChange={(e) => setEditedTitle(e.target.value)}
                className="task-title-input"
                placeholder="Task Title"
              />
            ) : (
              <h1>{task.title}</h1>
            )}
            {isAssignedToMe && (
              <span className="assigned-badge-large">Assigned to you</span>
            )}
          </div>
          {isTeamLeader && (
            <div className="task-header-actions">
              {isEditing ? (
                <>
                  <button onClick={handleSave} className="save-button-large" title="Save">
                    <FaSave style={{ marginRight: '6px' }} />
                    Save
                  </button>
                  <button onClick={handleCancel} className="cancel-edit-button-large" title="Cancel">
                    Cancel
                  </button>
                </>
              ) : (
                <button onClick={() => setIsEditing(true)} className="edit-button-large" title="Edit Task">
                  <FaEdit style={{ marginRight: '6px' }} />
                  Edit
                </button>
              )}
              <button onClick={handleDelete} className="delete-button-large" title="Delete">
                <FaTrash />
              </button>
            </div>
          )}
        </div>

        <div className="task-details-content">
          <div className="task-main-info">
            <div className="task-status-section">
              <label>Status</label>
              <div className="status-display" style={{ backgroundColor: statusInfo.color }}>
                {statusInfo.icon}
                <span>{statusInfo.label}</span>
              </div>
              {(isAssignedToMe || isTeamLeader) && (
                <select
                  value={task.status}
                  onChange={(e) => handleStatusChange(e.target.value)}
                  className="status-select-large"
                >
                  <option value="not_started">Not Started</option>
                  <option value="in_progress">In Progress</option>
                  <option value="problematic">Problematic</option>
                  <option value="completed">Completed</option>
                </select>
              )}
            </div>

            <div className="task-description-section">
              <label>Description</label>
              {isTeamLeader && isEditing ? (
                <textarea
                  value={editedDescription}
                  onChange={(e) => setEditedDescription(e.target.value)}
                  className="task-description-textarea"
                  placeholder="Enter task description"
                  rows="6"
                />
              ) : (
                <div className="description-content">
                  {task.description || 'No description provided'}
                </div>
              )}
            </div>

            <div className="task-meta-grid">
              <div className="meta-item">
                <label>
                  <FaUser style={{ marginRight: '6px' }} />
                  Assigned To
                </label>
                <div className="meta-value">{assigneeName}</div>
                {isTeamLeader && (
                  <div className="reassign-section-large">
                    {!showReassign ? (
                      <button
                        onClick={() => setShowReassign(true)}
                        className="reassign-button-large"
                      >
                        <FaExchangeAlt style={{ marginRight: '6px' }} />
                        Reassign
                      </button>
                    ) : (
                      <div className="reassign-form-large">
                        <select
                          value={newAssigneeId}
                          onChange={(e) => setNewAssigneeId(e.target.value)}
                          className="reassign-select-large"
                        >
                          <option value="">Select member</option>
                          {teamMembers.map((member) => (
                            <option key={member.id} value={member.id}>
                              {member.name}
                            </option>
                          ))}
                        </select>
                        <button onClick={handleReassign} className="confirm-reassign-button-large">
                          Confirm
                        </button>
                        <button
                          onClick={() => {
                            setShowReassign(false)
                            setNewAssigneeId('')
                          }}
                          className="cancel-reassign-button-large"
                        >
                          Cancel
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="meta-item">
                <label>
                  <FaFlag style={{ marginRight: '6px' }} />
                  Priority
                </label>
                {isTeamLeader && isEditing ? (
                  <select
                    value={editedPriority}
                    onChange={(e) => setEditedPriority(e.target.value)}
                    className="priority-select-large"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                ) : (
                  <div 
                    className="priority-badge-large"
                    style={{ color: getPriorityColor(task.priority) }}
                  >
                    {getPriorityLabel(task.priority)}
                  </div>
                )}
              </div>

              <div className="meta-item">
                <label>
                  <FaCalendarAlt style={{ marginRight: '6px' }} />
                  Due Date
                </label>
                {isTeamLeader && isEditing ? (
                  <input
                    type="date"
                    value={editedDueDate}
                    onChange={(e) => setEditedDueDate(e.target.value)}
                    className="due-date-input-large"
                  />
                ) : (
                  <div className="meta-value">
                    {task.dueDate ? formatDate(task.dueDate) : 'No due date'}
                  </div>
                )}
              </div>

              <div className="meta-item">
                <label>Created At</label>
                <div className="meta-value">{formatDate(task.createdAt)}</div>
              </div>
            </div>

            {isAssignedToMe && !isTeamLeader && task.status !== 'problematic' && task.status !== 'completed' && (
              <div className="problematic-section">
                <button
                  onClick={handleMarkAsProblematic}
                  className="problematic-button-large"
                >
                  <FaExclamationTriangle style={{ marginRight: '6px' }} />
                  Mark as Problematic
                </button>
              </div>
            )}

            {task.status === 'problematic' && task.problematicComment && (
              <div className="problematic-comment-section">
                <label>Problematic Comment</label>
                <div className="problematic-comment-content">
                  {task.problematicComment}
                </div>
              </div>
            )}

            {/* Comments Section */}
            <div className="comments-section">
              <label>
                <FaComment style={{ marginRight: '6px' }} />
                Comments ({task.comments?.length || 0})
              </label>
              
              <div className="comments-list">
                {task.comments && task.comments.length > 0 ? (
                  task.comments.map((comment) => {
                    const isMyComment = comment.userId === currentUser?.id
                    const isEditing = editingCommentId === comment.id

                    return (
                      <div key={comment.id} className="comment-item">
                        <div className="comment-header">
                          <div className="comment-author">
                            <div className="comment-avatar">
                              {comment.userName?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || 'U'}
                            </div>
                            <div className="comment-author-info">
                              <span className="comment-author-name">{comment.userName || 'Unknown'}</span>
                              <span className="comment-date">{formatDateTime(comment.createdAt)}</span>
                            </div>
                          </div>
                          {isMyComment && !isEditing && (
                            <div className="comment-actions">
                              <button
                                onClick={() => handleEditComment(comment.id, comment.text)}
                                className="comment-edit-button"
                                title="Edit comment"
                              >
                                <FaEdit />
                              </button>
                              <button
                                onClick={() => handleDeleteComment(comment.id)}
                                className="comment-delete-button"
                                title="Delete comment"
                              >
                                <FaTrash />
                              </button>
                            </div>
                          )}
                        </div>
                        {isEditing ? (
                          <div className="comment-edit-form">
                            <textarea
                              value={editingCommentText}
                              onChange={(e) => setEditingCommentText(e.target.value)}
                              className="comment-edit-input"
                              rows="3"
                            />
                            <div className="comment-edit-actions">
                              <button
                                onClick={() => handleSaveComment(comment.id)}
                                className="comment-save-button"
                              >
                                <FaSave style={{ marginRight: '6px' }} />
                                Save
                              </button>
                              <button
                                onClick={handleCancelEdit}
                                className="comment-cancel-button"
                              >
                                <FaTimes style={{ marginRight: '6px' }} />
                                Cancel
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="comment-text">{comment.text}</div>
                        )}
                      </div>
                    )
                  })
                ) : (
                  <div className="no-comments">No comments yet. Be the first to comment!</div>
                )}
              </div>

              <form onSubmit={handleAddComment} className="comment-form">
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Add a comment..."
                  className="comment-input"
                  rows="3"
                />
                <button type="submit" className="comment-submit-button">
                  <FaPaperPlane style={{ marginRight: '6px' }} />
                  Post Comment
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {showProblematicModal && (
        <div className="modal-overlay" onClick={() => setShowProblematicModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>Mark Task as Problematic</h3>
            <p>Please provide a comment explaining why this task is problematic:</p>
            <textarea
              value={problematicComment}
              onChange={(e) => setProblematicComment(e.target.value)}
              className="problematic-comment-textarea"
              placeholder="Enter your comment..."
              rows="5"
            />
            <div className="modal-actions">
              <button onClick={handleSubmitProblematic} className="submit-problematic-button">
                Submit
              </button>
              <button 
                onClick={() => {
                  setShowProblematicModal(false)
                  setProblematicComment('')
                }} 
                className="cancel-problematic-button"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      </div>
    </DashboardLayout>
  )
}

export default TaskDetails

