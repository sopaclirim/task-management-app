import { useState } from 'react'
import { useTasks } from '../context/TaskContext'
import { FaUser, FaTasks, FaCheckCircle, FaClock, FaExclamationTriangle, FaPauseCircle, FaChevronLeft, FaChevronRight } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'
import './TasksByMember.css'

const TasksByMember = () => {
  const { tasks, teamMembers } = useTasks()
  const navigate = useNavigate()
  const [currentPage, setCurrentPage] = useState(1)
  const membersPerPage = 3

  const tasksByMember = teamMembers.map(member => {
    const memberTasks = tasks.filter(t => t.assigneeId === member.id)
    return {
      member,
      tasks: memberTasks,
      stats: {
        total: memberTasks.length,
        notStarted: memberTasks.filter(t => t.status === 'not_started').length,
        inProgress: memberTasks.filter(t => t.status === 'in_progress').length,
        problematic: memberTasks.filter(t => t.status === 'problematic').length,
        completed: memberTasks.filter(t => t.status === 'completed').length,
      }
    }
  })

  // Pagination logic
  const totalPages = Math.ceil(tasksByMember.length / membersPerPage)
  const startIndex = (currentPage - 1) * membersPerPage
  const endIndex = startIndex + membersPerPage
  const currentMembers = tasksByMember.slice(startIndex, endIndex)

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1)
    }
  }

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1)
    }
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

  return (
    <div className="tasks-by-member">
      <h3 className="section-title">
        <FaUser className="section-icon" />
        Tasks by Team Member
      </h3>
      <div className="members-grid">
        {currentMembers.map(({ member, tasks: memberTasks, stats }) => (
          <div key={member.id} className="member-card">
            <div className="member-header">
              <div className="member-avatar">
                {member.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
              </div>
              <div className="member-info">
                <h4 className="member-name">{member.name}</h4>
                <p className="member-email">{member.email}</p>
              </div>
            </div>
            
            <div className="member-stats">
              <div className="stat-item total">
                <FaTasks />
                <span className="stat-number">{stats.total}</span>
                <span className="stat-label">Total</span>
              </div>
              <div className="stat-item not-started">
                <FaPauseCircle />
                <span className="stat-number">{stats.notStarted}</span>
                <span className="stat-label">Not Started</span>
              </div>
              <div className="stat-item in-progress">
                <FaClock />
                <span className="stat-number">{stats.inProgress}</span>
                <span className="stat-label">In Progress</span>
              </div>
              <div className="stat-item problematic">
                <FaExclamationTriangle />
                <span className="stat-number">{stats.problematic}</span>
                <span className="stat-label">Problematic</span>
              </div>
              <div className="stat-item completed">
                <FaCheckCircle />
                <span className="stat-number">{stats.completed}</span>
                <span className="stat-label">Completed</span>
              </div>
            </div>

            <div 
              className="view-profile-button"
              onClick={() => navigate(`/dashboard/member/${member.id}`)}
            >
              View All Tasks ({stats.total})
            </div>
          </div>
        ))}
      </div>
      
      {totalPages > 1 && (
        <div className="pagination">
          <button
            onClick={handlePreviousPage}
            disabled={currentPage === 1}
            className="pagination-button"
          >
            <FaChevronLeft />
          </button>
          <span className="pagination-info">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
            className="pagination-button"
          >
            <FaChevronRight />
          </button>
        </div>
      )}
    </div>
  )
}

export default TasksByMember;