import { useTasks } from '../context/TaskContext'
import DashboardLayout from './DashboardLayout'
import TaskList from './TaskList'
import CreateTask from './CreateTask'
import TaskStats from './TaskStats'
import './Dashboard.css'

const Dashboard = () => {
  const { currentUser } = useTasks()
  const isTeamLeader = currentUser?.role === 'team_leader'

  return (
    <DashboardLayout>
      <div className="dashboard-content">
        <div className="dashboard-header">
          <h1>{isTeamLeader ? 'Admin Dashboard' : 'Dashboard'}</h1>
        </div>

        <div className="dashboard-main">
          {isTeamLeader && (
            <div className="dashboard-section">
              <CreateTask />
            </div>
          )}

          <div className="dashboard-section">
            <TaskStats />
          </div>

          <div className="dashboard-section">
            <TaskList />
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

export default Dashboard

