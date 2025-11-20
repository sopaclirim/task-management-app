import { useEffect, useState } from 'react'
import './LoadingScreen.css'

const LoadingScreen = () => {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    // Hide loading screen after a minimum display time
    const timer = setTimeout(() => {
      setIsVisible(false)
    }, 4000) // 4 seconds

    return () => clearTimeout(timer)
  }, [])

  if (!isVisible) return null

  return (
    <div className="loading-screen">
      <div className="loading-content">
        <div className="loading-logo">
          <div className="logo-container">
            <div className="logo-circle">
              <svg className="logo-svg" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                <circle className="logo-circle-bg" cx="50" cy="50" r="45" />
                <path 
                  className="logo-check" 
                  d="M30 50 L42 62 L70 34" 
                  stroke="white" 
                  strokeWidth="6" 
                  fill="none" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                />
                <rect 
                  className="logo-clipboard" 
                  x="25" 
                  y="20" 
                  width="50" 
                  height="60" 
                  rx="4" 
                  fill="none" 
                  stroke="white" 
                  strokeWidth="3"
                />
                <rect 
                  className="logo-clip" 
                  x="40" 
                  y="15" 
                  width="20" 
                  height="8" 
                  rx="2" 
                  fill="white"
                />
              </svg>
            </div>
            <div className="logo-glow"></div>
          </div>
        </div>
        <h1 className="loading-title">
          <span className="title-scan">Scan</span>
          <span className="title-task">Task</span>
        </h1>
        <div className="loading-spinner">
          <div className="spinner-ring"></div>
          <div className="spinner-ring"></div>
          <div className="spinner-ring"></div>
        </div>
      </div>
    </div>
  )
}

export default LoadingScreen

