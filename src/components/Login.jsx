import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTasks } from '../context/TaskContext'
import { FaSignInAlt, FaEnvelope, FaLock } from 'react-icons/fa'
import './Login.css'

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const { login, teamMembers } = useTasks()
  const navigate = useNavigate()

  const handleSubmit = (e) => {
    e.preventDefault()

    // Simple authentication - in production, this would be an API call
    if (email === 'leader@company.com' && password === 'leader123') {
      login({
        id: 0,
        name: 'Team Leader',
        email: 'leader@company.com',
        role: 'team_leader',
      })
      navigate('/dashboard')
    } else {
      const member = teamMembers.find((m) => m.email === email)
      if (member && password === 'member123') {
        login(member)
        navigate('/dashboard')
      } else {
        alert('Invalid email or password!')
      }
    }
  }

  return (
    <div className="login-container">
      <div className="login-card">
        <h1>Scan Task Management</h1>
        <p className="subtitle">Sign in to the task management system</p>
        
        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="email">
              <FaEnvelope style={{ marginRight: '6px', fontSize: '14px', color: '#ffffff' }} />
              Email:
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">
              <FaLock style={{ marginRight: '6px', fontSize: '14px', color: '#ffffff' }} />
              Password:
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
          </div>

          <button type="submit" className="login-button">
            <FaSignInAlt style={{ marginRight: '8px', color: '#ffffff' }} />
            Sign In
          </button>
        </form>

        <div className="login-info">
          <p><strong>Test Accounts:</strong></p>
          <p>Team Leader: leader@company.com / leader123</p>
          <p>Team Member: vesa@company.com / member123</p>
        </div>
      </div>
    </div>
  )
}

export default Login

