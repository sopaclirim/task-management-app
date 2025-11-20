import { useState, useRef } from 'react'
import { useTasks } from '../context/TaskContext'
import DashboardLayout from './DashboardLayout'
import { FaUser, FaEnvelope, FaBriefcase, FaCamera } from 'react-icons/fa'
import './Profile.css'

const Profile = () => {
  const { currentUser, updateUserAvatar } = useTasks()
  const [avatarPreview, setAvatarPreview] = useState(currentUser?.avatar || null)
  const fileInputRef = useRef(null)

  const getInitials = (name) => {
    if (!name) return 'U'
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  const handleAvatarClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file')
      return
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('Image size should be less than 5MB')
      return
    }

    // Create preview
    const reader = new FileReader()
    reader.onloadend = () => {
      const imageUrl = reader.result
      setAvatarPreview(imageUrl)
      
      // Update user avatar in context
      if (updateUserAvatar) {
        updateUserAvatar(imageUrl)
      }
    }
    reader.readAsDataURL(file)
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
            <div className="profile-avatar-large" onClick={handleAvatarClick}>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                className="avatar-upload-input"
              />
              {avatarPreview ? (
                <img src={avatarPreview} alt={currentUser?.name} />
              ) : (
                <div className="avatar-placeholder-large">
                  {getInitials(currentUser?.name)}
                </div>
              )}
              <div className="avatar-upload-overlay">
                <FaCamera className="avatar-upload-icon" />
              </div>
            </div>
            <h2>{currentUser?.name || 'User'}</h2>
            <p className="profile-role">
              {currentUser?.role === 'team_leader' ? 'Team Leader' : 'Team Member'}
            </p>
            <p className="avatar-upload-hint">Click on avatar to upload a new photo</p>
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

