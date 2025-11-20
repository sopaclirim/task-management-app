import { useState } from 'react'
import { useTasks } from '../context/TaskContext'
import DashboardLayout from './DashboardLayout'
import { FaBell, FaLock, FaPalette, FaLanguage } from 'react-icons/fa'
import './Settings.css'

const Settings = () => {
  const { currentUser } = useTasks()
  const [notifications, setNotifications] = useState(true)
  const [emailNotifications, setEmailNotifications] = useState(true)

  return (
    <DashboardLayout>
      <div className="settings-container">
        <div className="settings-header">
          <h1>Settings</h1>
        </div>
        <div className="settings-content">
          <div className="settings-section">
            <div className="section-header">
              <FaBell className="section-icon" />
              <h2>Notifications</h2>
            </div>
            <div className="settings-card">
              <div className="setting-item">
                <div className="setting-info">
                  <label>Push Notifications</label>
                  <p>Receive notifications for task updates</p>
                </div>
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={notifications}
                    onChange={(e) => setNotifications(e.target.checked)}
                  />
                  <span className="slider"></span>
                </label>
              </div>
              <div className="setting-item">
                <div className="setting-info">
                  <label>Email Notifications</label>
                  <p>Receive email alerts for important updates</p>
                </div>
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={emailNotifications}
                    onChange={(e) => setEmailNotifications(e.target.checked)}
                  />
                  <span className="slider"></span>
                </label>
              </div>
            </div>
          </div>
          <div className="settings-section">
            <div className="section-header">
              <FaLock className="section-icon" />
              <h2>Security</h2>
            </div>
            <div className="settings-card">
              <div className="setting-item">
                <div className="setting-info">
                  <label>Change Password</label>
                  <p>Update your account password</p>
                </div>
                <button className="action-button">Change</button>
              </div>
              <div className="setting-item">
                <div className="setting-info">
                  <label>Two-Factor Authentication</label>
                  <p>Add an extra layer of security</p>
                </div>
                <button className="action-button secondary">Enable</button>
              </div>
            </div>
          </div>
          <div className="settings-section">
            <div className="section-header">
              <FaPalette className="section-icon" />
              <h2>Appearance</h2>
            </div>
            <div className="settings-card">
              <div className="setting-item">
                <div className="setting-info">
                  <label>Theme</label>
                  <p>Choose your preferred theme</p>
                </div>
                <select className="select-input">
                  <option>Light</option>
                  <option>Dark</option>
                  <option>Auto</option>
                </select>
              </div>
            </div>
          </div>
          <div className="settings-section">
            <div className="section-header">
              <FaLanguage className="section-icon" />
              <h2>Language & Region</h2>
            </div>
            <div className="settings-card">
              <div className="setting-item">
                <div className="setting-info">
                  <label>Language</label>
                  <p>Select your preferred language</p>
                </div>
                <select className="select-input">
                  <option>English</option>
                  <option>Albanian</option>
                  <option>Spanish</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

export default Settings
