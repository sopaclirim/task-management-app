import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useTasks } from '../context/TaskContext'
import { FaSignOutAlt, FaUser, FaCog, FaTasks, FaBars, FaTimes } from 'react-icons/fa'
import './Sidebar.css'

const Sidebar = () => {
  const { currentUser, logout } = useTasks();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const isTeamLeader = currentUser?.role === 'team_leader'

  // Get user initials for avatar
  const getInitials = (name) => {
    if (!name) return 'U'
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  const handleNavClick = (path) => {
    navigate(path)
    setIsMobileMenuOpen(false)
  }

  return (
    <>
      <button className="mobile-menu-toggle" onClick={toggleMobileMenu}>
        {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
      </button>
      {isMobileMenuOpen && (
        <div className="sidebar-overlay" onClick={toggleMobileMenu}></div>
      )}
      <aside className={`sidebar ${isMobileMenuOpen ? 'mobile-open' : ''}`}>
        <div className="sidebar-header">
          <div className="sidebar-logo">
            <FaTasks className="logo-icon" />
            <span className="logo-text">Scan Task</span>
          </div>
        </div>

      <div className="sidebar-user">
        <div className="user-avatar">
          {currentUser?.avatar ? (
            <img src={currentUser.avatar} alt={currentUser.name} />
          ) : (
            <div className="avatar-placeholder">
              {getInitials(currentUser?.name)}
            </div>
          )}
        </div>
        <div className="user-info">
          <h3 className="user-name">{currentUser?.name || 'User'}</h3>
          <p className="user-email">{currentUser?.email || ''}</p>
          <span className={`user-role-badge ${currentUser?.role}`}>
            {isTeamLeader ? 'Team Leader' : 'Team Member'}
          </span>
        </div>
      </div>

      <nav className="sidebar-nav">
        <button 
          className={`nav-item ${location.pathname === '/dashboard' ? 'active' : ''}`}
          onClick={() => handleNavClick('/dashboard')}
        >
          <FaTasks className="nav-icon" />
          <span>Dashboard</span>
        </button>
        <button 
          className={`nav-item ${location.pathname === '/profile' ? 'active' : ''}`}
          onClick={() => handleNavClick('/profile')}
        >
          <FaUser className="nav-icon" />
          <span>Profile</span>
        </button>
        <button 
          className={`nav-item ${location.pathname === '/settings' ? 'active' : ''}`}
          onClick={() => handleNavClick('/settings')}
        >
          <FaCog className="nav-icon" />
          <span>Settings</span>
        </button>
      </nav>

      <div className="sidebar-footer">
        <button className="logout-button" onClick={handleLogout}>
          <FaSignOutAlt className="logout-icon" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
    </>
  )
}

export default Sidebar

