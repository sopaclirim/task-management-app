import { useTasks } from '../context/TaskContext'
import DashboardLayout from './DashboardLayout'
import TaskList from './TaskList'
import CreateTask from './CreateTask'
import TaskStats from './TaskStats'
import TasksByMember from './TasksByMember'
import { FaRocket, FaTasks, FaChartLine, FaBell, FaClock, FaCalendarAlt } from 'react-icons/fa'
import './Dashboard.css'

const Dashboard = () => {
  const { currentUser, tasks } = useTasks()
  const isTeamLeader = currentUser?.role === 'team_leader'
  
  const userTasks = isTeamLeader 
    ? tasks 
    : tasks.filter(t => t.assigneeId === currentUser?.id)
  
  const recentTasks = userTasks
    .sort((a, b) => new Date(b.createdAt || b.id) - new Date(a.createdAt || a.id))
    .slice(0, 2)
  
  const urgentTasks = userTasks.filter(t => 
    t.priority === 'high' && t.status !== 'completed'
  ).length

  return (
    <DashboardLayout>
      <div className="dashboard-content">
        <div className="dashboard-header">
          <h1>{isTeamLeader ? 'Admin Dashboard' : 'Dashboard'}</h1>
        </div>

        <div className="dashboard-main">
          {/* Welcome Card */}
          <div className="dashboard-section welcome-card">
            <div className="welcome-content">
              <div className="welcome-text">
                <h2>
                  <FaRocket className="welcome-icon" />
                  Welcome back, {currentUser?.name || 'User'}!
                </h2>
                <p>
                  {userTasks.length === 0 
                    ? "You don't have any tasks yet. Start by creating your first task!"
                    : `You have ${userTasks.length} task${userTasks.length !== 1 ? 's' : ''} in total. Keep up the great work!`
                  }
                </p>
              </div>
              {urgentTasks > 0 && (
                <div className="urgent-badge">
                  <FaBell />
                  <span>{urgentTasks} Urgent Task{urgentTasks !== 1 ? 's' : ''}</span>
                </div>
              )}
            </div>
          </div>

          {isTeamLeader && (
            <div className="dashboard-section">
              <CreateTask />
            </div>
          )}

          <div className="dashboard-section">
            <TaskStats />
          </div>

          {/* Quick Stats */}
          {recentTasks.length > 0 && (
            <div className="dashboard-section">
              <h3 className="section-title">
                <FaClock className="section-icon" />
                Recent Tasks
              </h3>
              <div className="recent-tasks-list">
                {recentTasks.map((task) => (
                  <div key={task.id} className="recent-task-item">
                    <div className="recent-task-info">
                      <div className="recent-task-header">
                        <span className="recent-task-title">{task.title}</span>
                        {task.priority === 'high' && (
                          <span className="recent-task-priority high">High</span>
                        )}
                      </div>
                      <div className="recent-task-meta">
                        <span className="recent-task-date">
                          <FaCalendarAlt style={{ marginRight: '6px', fontSize: '12px' }} />
                          {task.createdAt ? new Date(task.createdAt).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          }) : 'No date'}
                        </span>
                        <span className={`recent-task-status status-${task.status}`}>
                          {task.status.replace('_', ' ')}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {isTeamLeader && (
            <div className="dashboard-section">
              <TasksByMember />
            </div>
          )}

          <div className="dashboard-section">
            <TaskList />
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

export default Dashboard

