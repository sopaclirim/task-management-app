import { useTasks } from '../context/TaskContext'
import TaskItem from './TaskItem'
import { FaPauseCircle, FaClock, FaExclamationTriangle, FaCheckCircle } from 'react-icons/fa'
import './TaskList.css'

const TaskList = () => {
  const { currentUser, tasks } = useTasks()
  const isTeamLeader = currentUser?.role === 'team_leader'

  // Show all tasks for everyone
  const allTasks = tasks

  const tasksByStatus = {
    not_started: allTasks.filter((t) => t.status === 'not_started'),
    in_progress: allTasks.filter((t) => t.status === 'in_progress'),
    problematic: allTasks.filter((t) => t.status === 'problematic'),
    completed: allTasks.filter((t) => t.status === 'completed'),
  }

  if (allTasks.length === 0) {
    return (
      <div className="task-list">
        <h2>All Tasks</h2>
        <div className="empty-state">
          <p>No tasks at the moment.</p>
          {isTeamLeader && (
            <p className="empty-hint">Click "Create New Task" to add new tasks.</p>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="task-list">
      <h2>All Tasks</h2>

      <div className="tasks-container">
        <div className="status-column">
          <h3 className="status-header not-started">
            <FaPauseCircle className="status-icon" />
            <span className="status-text">Not Started</span>
            <span className="status-count">{tasksByStatus.not_started.length}</span>
          </h3>
          <div className="tasks-column">
            {tasksByStatus.not_started.map((task) => (
              <TaskItem key={task.id} task={task} />
            ))}
          </div>
        </div>

        <div className="status-column">
          <h3 className="status-header in-progress">
            <FaClock className="status-icon" />
            <span className="status-text">In Progress</span>
            <span className="status-count">{tasksByStatus.in_progress.length}</span>
          </h3>
          <div className="tasks-column">
            {tasksByStatus.in_progress.map((task) => (
              <TaskItem key={task.id} task={task} />
            ))}
          </div>
        </div>

        <div className="status-column">
          <h3 className="status-header problematic">
            <FaExclamationTriangle className="status-icon" />
            <span className="status-text">Problematic</span>
            <span className="status-count">{tasksByStatus.problematic.length}</span>
          </h3>
          <div className="tasks-column">
            {tasksByStatus.problematic.map((task) => (
              <TaskItem key={task.id} task={task} />
            ))}
          </div>
        </div>

        <div className="status-column">
          <h3 className="status-header completed">
            <FaCheckCircle className="status-icon" />
            <span className="status-text">Completed</span>
            <span className="status-count">{tasksByStatus.completed.length}</span>
          </h3>
          <div className="tasks-column">
            {tasksByStatus.completed.map((task) => (
              <TaskItem key={task.id} task={task} />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default TaskList

