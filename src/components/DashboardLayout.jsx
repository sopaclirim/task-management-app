import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { useTasks } from '../context/TaskContext'
import Sidebar from './Sidebar'
import { FaBars, FaTimes } from 'react-icons/fa'
import './DashboardLayout.css'

const DashboardLayout = ({ children }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const location = useLocation()
  const { currentUser } = useTasks()
  const isTeamLeader = currentUser?.role === 'team_leader'
  const pageTitle = location.pathname === '/profile' 
    ? 'Profile' 
    : location.pathname === '/settings' 
    ? 'Settings' 
    : isTeamLeader 
    ? 'Admin Dashboard' 
    : 'Dashboard'

  useEffect(() => {
    // Smooth scroll to top when route changes
    window.scrollTo({ top: 0, behavior: 'smooth' })
    setIsMobileMenuOpen(false)
  }, [location.pathname])

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  return (
    <div className="dashboard-layout">
      <Sidebar isMobileMenuOpen={isMobileMenuOpen} onCloseMenu={() => setIsMobileMenuOpen(false)} />
      <main className="dashboard-content-wrapper">
        <div className="mobile-header">
          <button className="mobile-menu-toggle" onClick={toggleMobileMenu}>
            {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
          </button>
          <h1 className="mobile-header-title">{pageTitle}</h1>
        </div>
        <div className="dashboard-content-inner">
          {children}
        </div>
      </main>
    </div>
  )
}

export default DashboardLayout

