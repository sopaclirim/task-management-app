// Email notification service
// In a real application, this would call an API endpoint to send emails

export const sendEmailNotification = async (to, subject, message) => {
  // In production, this would make an API call to your email service
  // For now, we'll log it to console and could integrate with services like:
  // - SendGrid
  // - AWS SES
  // - Nodemailer (if you have a backend)
  
  console.log('📧 Email Notification:', {
    to,
    subject,
    message,
    timestamp: new Date().toISOString(),
  })

  // Simulate API call
  return new Promise((resolve) => {
    setTimeout(() => {
      // In production, replace this with actual API call
      // Example: return fetch('/api/send-email', { method: 'POST', body: JSON.stringify({ to, subject, message }) })
      resolve({ success: true })
    }, 100)
  })
}

export const notifyTaskAssigned = async (assigneeEmail, assigneeName, taskTitle, taskDescription) => {
  const subject = `New Task Assigned: ${taskTitle}`
  const message = `
    Hello ${assigneeName},
    
    A new task has been assigned to you:
    
    Title: ${taskTitle}
    ${taskDescription ? `Description: ${taskDescription}` : ''}
    
    Please log in to the task management system to view and start working on this task.
    
    Best regards,
    Task Management System
  `
  
  return sendEmailNotification(assigneeEmail, subject, message)
}

export const notifyTaskCompleted = async (leaderEmail, leaderName, taskTitle, completedBy) => {
  const subject = `Task Completed: ${taskTitle}`
  const message = `
    Hello ${leaderName},
    
    The following task has been marked as completed:
    
    Title: ${taskTitle}
    Completed by: ${completedBy}
    
    Please review the task in the task management system.
    
    Best regards,
    Task Management System
  `
  
  return sendEmailNotification(leaderEmail, subject, message)
}

export const notifyTaskReassigned = async (newAssigneeEmail, newAssigneeName, taskTitle, previousAssignee) => {
  const subject = `Task Reassigned to You: ${taskTitle}`
  const message = `
    Hello ${newAssigneeName},
    
    A task has been reassigned to you:
    
    Title: ${taskTitle}
    Previous assignee: ${previousAssignee}
    
    Please log in to the task management system to view this task.
    
    Best regards,
    Task Management System
  `
  
  return sendEmailNotification(newAssigneeEmail, subject, message)
}

export const notifyTaskProblematic = async (leaderEmail, leaderName, taskTitle, reportedBy) => {
  const subject = `Task Marked as Problematic: ${taskTitle}`
  const message = `
    Hello ${leaderName},
    
    A task has been marked as problematic:
    
    Title: ${taskTitle}
    Reported by: ${reportedBy}
    
    Please review the task and consider reassigning it if necessary.
    
    Best regards,
    Task Management System
  `
  
  return sendEmailNotification(leaderEmail, subject, message)
}

