import { useParams, useNavigate } from 'react-router-dom'
import { useTasks } from '../context/TaskContext'
import DashboardLayout from './DashboardLayout'
import { FaArrowLeft, FaUser, FaTasks, FaCheckCircle, FaClock, FaExclamationTriangle, FaPauseCircle, FaFlag, FaCalendarAlt } from 'react-icons/fa'
import './MemberProfile.css'

const MemberProfile = () => {
  const { memberId } = useParams()
  const navigate = useNavigate()
  const { tasks, teamMembers } = useTasks()
  
  const member = teamMembers.find(m => m.id === parseInt(memberId))
  const memberTasks = tasks.filter(t => t.assigneeId === parseInt(memberId))

  if (!member) {
    return (
      <DashboardLayout>
        <div className="member-profile-container">
          <div className="member-not-found">
            <h2>Member not found</h2>
            <button onClick={() => navigate('/dashboard')} className="back-button">
              <FaArrowLeft style={{ marginRight: '6px' }} />
              Back to Dashboard
            </button>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  const getStatusIcon = (status) => {
    switch(status) {
      case 'not_started': return <FaPauseCircle />
      case 'in_progress': return <FaClock />
      case 'problematic': return <FaExclamationTriangle />
      case 'completed': return <FaCheckCircle />
      default: return <FaTasks />
    }
  }

  const getStatusColor = (status) => {
    switch(status) {
      case 'not_started': return '#dc3545'
      case 'in_progress': return '#ffc107'
      case 'problematic': return '#ffc107'
      case 'completed': return '#198754'
      default: return '#666'
    }
  }

  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'high': return '#dc3545'
      case 'medium': return '#ffc107'
      case 'low': return '#198754'
      default: return '#666'
    }
  }

  const stats = {
    total: memberTasks.length,
    notStarted: memberTasks.filter(t => t.status === 'not_started').length,
    inProgress: memberTasks.filter(t => t.status === 'in_progress').length,
    problematic: memberTasks.filter(t => t.status === 'problematic').length,
    completed: memberTasks.filter(t => t.status === 'completed').length,
  }

  const getInitials = (name) => {
    if (!name) return 'U'
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <DashboardLayout>
      <div className="member-profile-container">
        <button onClick={() => navigate('/dashboard')} className="back-button">
          <FaArrowLeft style={{ marginRight: '6px' }} />
          Back to Dashboard
        </button>

        <div className="member-profile-header">
          <div className="member-profile-avatar">
            {member.avatar ? (
              <img src={member.avatar} alt={member.name} />
            ) : (
              <div className="member-profile-avatar-placeholder">
                {getInitials(member.name)}
              </div>
            )}
          </div>
          <div className="member-profile-info">
            <h1>{member.name}</h1>
            <p className="member-profile-email">{member.email}</p>
            <span className={`member-profile-role ${member.role}`}>
              {member.role === 'team_leader' ? 'Team Leader' : 'Team Member'}
            </span>
          </div>
        </div>

        <div className="member-stats-section">
          <div className="stat-card total">
            <FaTasks className="stat-icon" />
            <div className="stat-content">
              <span className="stat-number">{stats.total}</span>
              <span className="stat-label">Total Tasks</span>
            </div>
          </div>
          <div className="stat-card not-started">
            <FaPauseCircle className="stat-icon" />
            <div className="stat-content">
              <span className="stat-number">{stats.notStarted}</span>
              <span className="stat-label">Not Started</span>
            </div>
          </div>
          <div className="stat-card in-progress">
            <FaClock className="stat-icon" />
            <div className="stat-content">
              <span className="stat-number">{stats.inProgress}</span>
              <span className="stat-label">In Progress</span>
            </div>
          </div>
          <div className="stat-card problematic">
            <FaExclamationTriangle className="stat-icon" />
            <div className="stat-content">
              <span className="stat-number">{stats.problematic}</span>
              <span className="stat-label">Problematic</span>
            </div>
          </div>
          <div className="stat-card completed">
            <FaCheckCircle className="stat-icon" />
            <div className="stat-content">
              <span className="stat-number">{stats.completed}</span>
              <span className="stat-label">Completed</span>
            </div>
          </div>
        </div>

        <div className="member-tasks-section">
          <h2>All Tasks ({memberTasks.length})</h2>
          {memberTasks.length > 0 ? (
            <div className="member-tasks-list">
              {memberTasks.map(task => (
                <div 
                  key={task.id} 
                  className="member-task-item"
                  onClick={() => navigate(`/dashboard/task/${task.id}`)}
                >
                  <div className="member-task-status" style={{ color: getStatusColor(task.status) }}>
                    {getStatusIcon(task.status)}
                  </div>
                  <div className="member-task-content">
                    <h3 className="member-task-title">{task.title}</h3>
                    <p className="member-task-description">{task.description}</p>
                    <div className="member-task-meta">
                      {task.priority && (
                        <span className="member-task-priority" style={{ color: getPriorityColor(task.priority) }}>
                          <FaFlag style={{ marginRight: '4px', fontSize: '10px' }} />
                          {task.priority.toUpperCase()}
                        </span>
                      )}
                      {task.dueDate && (
                        <span className="member-task-due-date">
                          <FaCalendarAlt style={{ marginRight: '4px', fontSize: '10px' }} />
                          {new Date(task.dueDate).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="no-tasks">
              <FaTasks className="no-tasks-icon" />
              <p>No tasks assigned to this member</p>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}

export default MemberProfile

