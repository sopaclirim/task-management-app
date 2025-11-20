# API Integration Guide

Ky dokument shpjegon si të lidhni frontend-in me backend-in tuaj.

## Konfigurimi

### 1. Krijo një skedar `.env` në root të projektit:

```env
VITE_API_BASE_URL=http://localhost:3000/api
```

Ndrysho URL-në sipas backend-it tënd. Për shembull:
- Development: `http://localhost:3000/api`
- Production: `https://api.yourdomain.com/api`

### 2. Përdor TaskContextWithAPI në vend të TaskContext

Në `src/App.jsx`, ndrysho import-in:

```jsx
// Nga:
import { TaskProvider } from './context/TaskContext'

// Në:
import { TaskProvider } from './context/TaskContextWithAPI'
```

## Backend API Endpoints që duhen

Backend-i yt duhet të ketë këto endpoints:

### Authentication
- `POST /api/auth/login` - Login me email dhe password
  - Request: `{ email: string, password: string }`
  - Response: `{ user: User, token?: string }`

- `POST /api/auth/logout` - Logout
  - Headers: `Authorization: Bearer <token>`

### Tasks
- `GET /api/tasks` - Merr të gjitha tasks
  - Headers: `Authorization: Bearer <token>`
  - Response: `Task[]`

- `GET /api/tasks/:id` - Merr një task specifik
  - Headers: `Authorization: Bearer <token>`
  - Response: `Task`

- `POST /api/tasks` - Krijo një task të ri
  - Headers: `Authorization: Bearer <token>`
  - Request: `{ title, description, assigneeId, priority, dueDate, ... }`
  - Response: `Task`

- `PUT /api/tasks/:id` - Update task
  - Headers: `Authorization: Bearer <token>`
  - Request: `{ title?, description?, priority?, dueDate?, ... }`
  - Response: `Task`

- `PATCH /api/tasks/:id/status` - Update status i task-ut
  - Headers: `Authorization: Bearer <token>`
  - Request: `{ status: string, comment?: string }`
  - Response: `Task`

- `PATCH /api/tasks/:id/assignee` - Update assignee i task-ut
  - Headers: `Authorization: Bearer <token>`
  - Request: `{ assigneeId: number }`
  - Response: `Task`

- `DELETE /api/tasks/:id` - Fshi task
  - Headers: `Authorization: Bearer <token>`

### Users
- `GET /api/users/me` - Merr përdoruesin aktual
  - Headers: `Authorization: Bearer <token>`
  - Response: `User`

- `GET /api/users/team-members` - Merr të gjithë team members
  - Headers: `Authorization: Bearer <token>`
  - Response: `User[]`

### Email (Optional)
- `POST /api/email/send` - Dërgo email
  - Headers: `Authorization: Bearer <token>`
  - Request: `{ to: string, subject: string, message: string }`
  - Response: `{ success: boolean }`

## Struktura e të dhënave

### Task Object
```typescript
{
  id: number
  title: string
  description: string
  assigneeId: number
  priority: 'low' | 'medium' | 'high'
  status: 'not_started' | 'in_progress' | 'problematic' | 'completed'
  dueDate: string | null
  createdAt: string
  problematicComment?: string
}
```

### User Object
```typescript
{
  id: number
  name: string
  email: string
  role: 'team_leader' | 'team_member'
}
```

## Fallback në localStorage

Nëse API call dështon, sistemi automatikisht përdor localStorage si fallback për të ruajtur funksionalitetin.

## Modifikimi i Login Component

Në `src/components/Login.jsx`, ndrysho `handleSubmit`:

```jsx
const handleSubmit = async (e) => {
  e.preventDefault()
  
  try {
    await login(email, password)
    navigate('/dashboard')
  } catch (error) {
    alert(error.message || 'Invalid email or password!')
  }
}
```

## Testimi

1. Sigurohu që backend-i yt është running
2. Ndrysho `VITE_API_BASE_URL` në `.env`
3. Restart dev server: `npm run dev`
4. Testo login dhe operacionet e tjera

## Error Handling

Sistemi trajton automatikisht errors dhe i shfaq në console. Mund të shtosh error handling më të avancuar në komponentët e tu.

