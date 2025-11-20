import { useState } from 'react'
import { useTasks } from '../context/TaskContext'
import { FaPlus, FaUser, FaFlag, FaCalendarAlt } from 'react-icons/fa'
import './CreateTask.css'

const CreateTask = () => {
  const { createTask, teamMembers } = useTasks()
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [assigneeId, setAssigneeId] = useState('')
  const [priority, setPriority] = useState('medium')
  const [dueDate, setDueDate] = useState('')
  const [showForm, setShowForm] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!title || !assigneeId) {
      alert('Please fill in all required fields!')
      return
    }

    await createTask({
      title,
      description,
      assigneeId: parseInt(assigneeId),
      priority,
      dueDate: dueDate || null,
      createdBy: 'team_leader',
    })

    // Reset form
    setTitle('')
    setDescription('')
    setAssigneeId('')
    setPriority('medium')
    setDueDate('')
    setShowForm(false)
    alert('Task created successfully! Email notification sent to the assigned member.')
  }

  if (!showForm) {
    return (
      <div className="create-task-toggle">
        <button onClick={() => setShowForm(true)} className="toggle-button">
          <FaPlus style={{ marginRight: '8px' }} />
          Create New Task
        </button>
      </div>
    )
  }

  return (
    <div className="create-task">
      <h2>Create New Task</h2>
      <form onSubmit={handleSubmit} className="task-form">
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="title">Task Title *</label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter task title"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="assignee">
              <FaUser style={{ marginRight: '6px', fontSize: '14px' }} />
              Assign To *
            </label>
            <select
              id="assignee"
              value={assigneeId}
              onChange={(e) => setAssigneeId(e.target.value)}
              required
            >
              <option value="">Select team member</option>
              {teamMembers.map((member) => (
                <option key={member.id} value={member.id}>
                  {member.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter task description"
            rows="4"
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="priority">
              <FaFlag style={{ marginRight: '6px', fontSize: '14px' }} />
              Priority
            </label>
            <select
              id="priority"
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="dueDate">
              <FaCalendarAlt style={{ marginRight: '6px', fontSize: '14px' }} />
              Due Date
            </label>
            <input
              type="date"
              id="dueDate"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
            />
          </div>
        </div>

        <div className="form-actions">
          <button type="submit" className="submit-button">
            Create Task
          </button>
          <button
            type="button"
            onClick={() => setShowForm(false)}
            className="cancel-button"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}

export default CreateTask

