import { useNavigate, useLocation } from 'react-router-dom'
import { useTasks } from '../context/TaskContext'
import { FaSignOutAlt, FaUser, FaCog, FaTasks } from 'react-icons/fa'
import './Sidebar.css'

const Sidebar = ({ isMobileMenuOpen, onCloseMenu }) => {
  const { currentUser, logout } = useTasks();
  const navigate = useNavigate();
  const location = useLocation();

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

  const handleNavClick = (path) => {
    navigate(path)
    if (onCloseMenu) {
      onCloseMenu()
    }
  }

  return (
    <>
      {isMobileMenuOpen && (
        <div className="sidebar-overlay" onClick={onCloseMenu}></div>
      )}
      <aside className={`sidebar ${isMobileMenuOpen ? 'mobile-open' : ''}`}>
        <div className="sidebar-header">
          <div className="sidebar-logo">
            <div className="logo-icon-wrapper">
              <svg className="logo-icon-svg" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                <circle className="logo-circle-bg-sidebar" cx="50" cy="50" r="40" />
                <path 
                  className="logo-check-sidebar" 
                  d="M30 50 L42 62 L70 34" 
                  stroke="white" 
                  strokeWidth="5" 
                  fill="none" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                />
                <rect 
                  className="logo-clipboard-sidebar" 
                  x="25" 
                  y="20" 
                  width="50" 
                  height="55" 
                  rx="3" 
                  fill="none" 
                  stroke="white" 
                  strokeWidth="2.5"
                />
                <rect 
                  className="logo-clip-sidebar" 
                  x="40" 
                  y="15" 
                  width="20" 
                  height="7" 
                  rx="1.5" 
                  fill="white"
                />
              </svg>
            </div>
            <span className="logo-text">ScanTask</span>
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

