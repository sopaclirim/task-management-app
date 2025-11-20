import { useEffect } from 'react'
import Sidebar from './Sidebar'
import './DashboardLayout.css'

const DashboardLayout = ({ children }) => {
  useEffect(() => {
    // Smooth scroll to top when route changes
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [children])

  return (
    <div className="dashboard-layout">
      <Sidebar />
      <main className="dashboard-content-wrapper">
        <div className="dashboard-content-inner">
          {children}
        </div>
      </main>
    </div>
  )
}

export default DashboardLayout

