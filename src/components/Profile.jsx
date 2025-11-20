import { useTasks } from '../context/TaskContext'
import DashboardLayout from './DashboardLayout'
import { FaUser, FaEnvelope, FaBriefcase } from 'react-icons/fa'
import './Profile.css'

const Profile = () => {
  const { currentUser } = useTasks()

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
      <div className="profile-container">
      <div className="profile-header">
        <h1>Profile</h1>
      </div>

      <div className="profile-content">
        <div className="profile-card">
          <div className="profile-avatar-section">
            <div className="profile-avatar-large">
              {currentUser?.avatar ? (
                <img src={currentUser.avatar} alt={currentUser.name} />
              ) : (
                <div className="avatar-placeholder-large">
                  {getInitials(currentUser?.name)}
                </div>
              )}
            </div>
            <h2>{currentUser?.name || 'User'}</h2>
            <p className="profile-role">
              {currentUser?.role === 'team_leader' ? 'Team Leader' : 'Team Member'}
            </p>
          </div>

          <div className="profile-info">
            <div className="info-item">
              <FaUser className="info-icon" />
              <div className="info-content">
                <label>Full Name</label>
                <p>{currentUser?.name || 'N/A'}</p>
              </div>
            </div>

            <div className="info-item">
              <FaEnvelope className="info-icon" />
              <div className="info-content">
                <label>Email</label>
                <p>{currentUser?.email || 'N/A'}</p>
              </div>
            </div>

            <div className="info-item">
              <FaBriefcase className="info-icon" />
              <div className="info-content">
                <label>Role</label>
                <p>
                  <span className={`role-badge ${currentUser?.role}`}>
                    {currentUser?.role === 'team_leader' ? 'Team Leader' : 'Team Member'}
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      </div>
    </DashboardLayout>
  )
}

export default Profile

