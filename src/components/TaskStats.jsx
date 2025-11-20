import { useTasks } from '../context/TaskContext'
import { 
  FaClipboardList, 
  FaPauseCircle, 
  FaSyncAlt, 
  FaCheckCircle, 
  FaChartLine 
} from 'react-icons/fa'
import './TaskStats.css'

const TaskStats = () => {
  const { currentUser, tasks, getTasksByAssignee } = useTasks()
  const isTeamLeader = currentUser?.role === 'team_leader'

  const userTasks = isTeamLeader
    ? tasks
    : getTasksByAssignee(currentUser?.id)

  const stats = {
    total: userTasks.length,
    notStarted: userTasks.filter((t) => t.status === 'not_started').length,
    inProgress: userTasks.filter((t) => t.status === 'in_progress').length,
    problematic: userTasks.filter((t) => t.status === 'problematic').length,
    completed: userTasks.filter((t) => t.status === 'completed').length,
  }

  const completionRate =
    stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0

  return (
    <div className="task-stats">
      <h2>Statistics</h2>
      <div className="stats-grid">
        <div className="stat-card total">
          <div className="stat-icon">
            <FaClipboardList />
          </div>
          <div className="stat-content">
            <div className="stat-value">{stats.total}</div>
            <div className="stat-label">Total Tasks</div>
          </div>
        </div>

        <div className="stat-card not-started">
          <div className="stat-icon">
            <FaPauseCircle />
          </div>
          <div className="stat-content">
            <div className="stat-value">{stats.notStarted}</div>
            <div className="stat-label">Not Started</div>
          </div>
        </div>

        <div className="stat-card in-progress">
          <div className="stat-icon">
            <FaSyncAlt />
          </div>
          <div className="stat-content">
            <div className="stat-value">{stats.inProgress}</div>
            <div className="stat-label">In Progress</div>
          </div>
        </div>

        <div className="stat-card completed">
          <div className="stat-icon">
            <FaCheckCircle />
          </div>
          <div className="stat-content">
            <div className="stat-value">{stats.completed}</div>
            <div className="stat-label">Completed</div>
          </div>
        </div>

        <div className="stat-card rate">
          <div className="stat-icon">
            <FaChartLine />
          </div>
          <div className="stat-content">
            <div className="stat-value">{completionRate}%</div>
            <div className="stat-label">Completion Rate</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TaskStats

