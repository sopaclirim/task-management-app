# Udhëzues për Kriimin e Backend-it - Task Management System

Ky dokument përmban të gjitha hapat dhe kërkesat për të krijuar backend-in me Node.js, Express dhe MySQL.

## 📋 Përmbledhje

Bazuar në frontend-in tuaj, ju duhet të krijoni një REST API që mbështet:
- Sistem autentifikimi me JWT
- Menaxhimin e task-eve (CRUD operations)
- Menaxhimin e përdoruesve dhe team members
- Sistem komentesh për task-eve
- Notifikime me email

---

## 1️⃣ Struktura e Projekti

### Krijimi i Direktoriveve
```
task-management-backend/
├── config/
│   ├── database.js          # Konfigurimi i MySQL connection
│   └── config.js            # Environment variables dhe config të tjera
├── controllers/
│   ├── authController.js    # Login, logout
│   ├── taskController.js    # CRUD operations për tasks
│   ├── userController.js    # Operacione për users
│   └── commentController.js # CRUD për comments
├── middleware/
│   ├── auth.js              # JWT verification middleware
│   └── errorHandler.js      # Error handling middleware
├── models/
│   ├── User.js              # User model
│   ├── Task.js              # Task model
│   └── Comment.js           # Comment model
├── routes/
│   ├── auth.js              # Auth routes
│   ├── tasks.js             # Task routes
│   ├── users.js             # User routes
│   └── comments.js          # Comment routes
├── services/
│   └── emailService.js      # Email sending service
├── utils/
│   ├── jwt.js               # JWT helper functions
│   └── password.js          # Password hashing utilities
├── .env                     # Environment variables
├── .gitignore
├── package.json
└── server.js                # Main entry point
```

---

## 2️⃣ Instalimi i Dependencies

### Paketat Kryesore:
```json
{
  "dependencies": {
    "express": "^4.18.2",
    "mysql2": "^3.6.0",
    "dotenv": "^16.3.1",
    "jsonwebtoken": "^9.0.2",
    "bcryptjs": "^2.4.3",
    "cors": "^2.8.5",
    "nodemailer": "^6.9.4",
    "express-validator": "^7.0.1"
  },
  "devDependencies": {
    "nodemon": "^3.0.1"
  }
}
```

### Komanda për Instalim:
```bash
npm init -y
npm install express mysql2 dotenv jsonwebtoken bcryptjs cors nodemailer express-validator
npm install --save-dev nodemon
```

---

## 3️⃣ Database Schema (MySQL)

### Tabela: `users`
```sql
CREATE TABLE users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role ENUM('team_leader', 'team_member') NOT NULL DEFAULT 'team_member',
  avatar VARCHAR(500) NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### Tabela: `tasks`
```sql
CREATE TABLE tasks (
  id INT PRIMARY KEY AUTO_INCREMENT,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  assignee_id INT NOT NULL,
  creator_id INT NOT NULL,
  priority ENUM('low', 'medium', 'high') DEFAULT 'medium',
  status ENUM('not_started', 'in_progress', 'problematic', 'completed') DEFAULT 'not_started',
  due_date DATE NULL,
  problematic_comment TEXT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (assignee_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (creator_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_assignee (assignee_id),
  INDEX idx_status (status),
  INDEX idx_created_at (created_at)
);
```

### Tabela: `comments`
```sql
CREATE TABLE comments (
  id INT PRIMARY KEY AUTO_INCREMENT,
  task_id INT NOT NULL,
  user_id INT NOT NULL,
  text TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (task_id) REFERENCES tasks(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_task_id (task_id)
);
```

### Tabela: `task_history` (Optional - për audit trail)
```sql
CREATE TABLE task_history (
  id INT PRIMARY KEY AUTO_INCREMENT,
  task_id INT NOT NULL,
  user_id INT NOT NULL,
  action VARCHAR(100) NOT NULL, -- 'created', 'status_changed', 'reassigned', etc.
  old_value TEXT NULL,
  new_value TEXT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (task_id) REFERENCES tasks(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

### Seed Data (Test Users)
```sql
-- Team Leader
INSERT INTO users (name, email, password, role) VALUES 
('Team Leader', 'leader@scantech.com', '$2a$10$hashed_password_here', 'team_leader');

-- Team Members
INSERT INTO users (name, email, password, role) VALUES 
('Vesa Mexhuani', 'vesa@scantech.com', '$2a$10$hashed_password_here', 'team_member'),
('Clirim Sopa', 'clirim@scantech.com', '$2a$10$hashed_password_here', 'team_member'),
('Shkodran Sopa', 'shkodran@scantech.com', '$2a$10$hashed_password_here', 'team_member'),
('Urim Canhasi', 'urim@scantech.com', '$2a$10$hashed_password_here', 'team_member');
```

**Note:** Duhet të hash-oni password-et me bcrypt para se t'i insert-oni.

---

## 4️⃣ Environment Variables (.env)

```env
# Server Configuration
PORT=3000
NODE_ENV=development

# Database Configuration
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=task_management_db
DB_PORT=3306

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_here_minimum_32_characters
JWT_EXPIRE=7d

# Email Configuration (Nodemailer)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_password
EMAIL_FROM=noreply@scantech.com

# Frontend URL (për CORS)
FRONTEND_URL=http://localhost:5173
```

---

## 5️⃣ API Endpoints që duhen Krijuar

### 🔐 Authentication Routes (`/api/auth`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/auth/login` | Login me email dhe password | ❌ |
| POST | `/api/auth/logout` | Logout | ✅ |

**Request Body për Login:**
```json
{
  "email": "leader@scantech.com",
  "password": "password123"
}
```

**Response për Login:**
```json
{
  "user": {
    "id": 1,
    "name": "Team Leader",
    "email": "leader@scantech.com",
    "role": "team_leader",
    "avatar": null
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

---

### 📋 Task Routes (`/api/tasks`)

| Method | Endpoint | Description | Auth Required | Role Required |
|--------|----------|-------------|---------------|---------------|
| GET | `/api/tasks` | Merr të gjitha task-et | ✅ | - |
| GET | `/api/tasks/:id` | Merr një task specifik | ✅ | - |
| POST | `/api/tasks` | Krijo task të ri | ✅ | team_leader |
| PUT | `/api/tasks/:id` | Update task (title, description, priority, dueDate) | ✅ | team_leader |
| PATCH | `/api/tasks/:id/status` | Update status i task-ut | ✅ | assignee ose team_leader |
| PATCH | `/api/tasks/:id/assignee` | Reassign task | ✅ | team_leader |
| DELETE | `/api/tasks/:id` | Fshi task | ✅ | team_leader |

**Request Body për Create Task:**
```json
{
  "title": "Implement new feature",
  "description": "Add user authentication",
  "assigneeId": 2,
  "priority": "high",
  "dueDate": "2024-12-31"
}
```

**Response për Get Task:**
```json
{
  "id": 1,
  "title": "Implement new feature",
  "description": "Add user authentication",
  "assigneeId": 2,
  "creatorId": 1,
  "priority": "high",
  "status": "not_started",
  "dueDate": "2024-12-31",
  "problematicComment": null,
  "createdAt": "2024-01-15T10:30:00.000Z",
  "updatedAt": "2024-01-15T10:30:00.000Z",
  "assignee": {
    "id": 2,
    "name": "Vesa Mexhuani",
    "email": "vesa@scantech.com"
  },
  "comments": []
}
```

**Request Body për Update Status:**
```json
{
  "status": "in_progress",
  "comment": "Optional comment when marking as problematic"
}
```

**Request Body për Update Assignee:**
```json
{
  "assigneeId": 3
}
```

---

### 👥 User Routes (`/api/users`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/users/me` | Merr përdoruesin aktual | ✅ |
| GET | `/api/users/team-members` | Merr të gjithë team members | ✅ |
| PUT | `/api/users/me/avatar` | Update avatar i përdoruesit | ✅ |

**Response për Get Team Members:**
```json
[
  {
    "id": 2,
    "name": "Vesa Mexhuani",
    "email": "vesa@scantech.com",
    "role": "team_member",
    "avatar": null
  },
  {
    "id": 3,
    "name": "Clirim Sopa",
    "email": "clirim@scantech.com",
    "role": "team_member",
    "avatar": null
  }
]
```

---

### 💬 Comment Routes (`/api/tasks/:taskId/comments`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/tasks/:taskId/comments` | Merr komente të një task-u | ✅ |
| POST | `/api/tasks/:taskId/comments` | Krijo koment të ri | ✅ |
| PUT | `/api/tasks/:taskId/comments/:commentId` | Update koment (vetëm owner) | ✅ |
| DELETE | `/api/tasks/:taskId/comments/:commentId` | Fshi koment (vetëm owner) | ✅ |

**Request Body për Create Comment:**
```json
{
  "text": "This task looks good, let's proceed!"
}
```

**Response për Comment:**
```json
{
  "id": 1,
  "taskId": 1,
  "userId": 2,
  "userName": "Vesa Mexhuani",
  "text": "This task looks good, let's proceed!",
  "createdAt": "2024-01-15T11:00:00.000Z",
  "updatedAt": "2024-01-15T11:00:00.000Z"
}
```

---

### 📧 Email Route (Optional - `/api/email`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/email/send` | Dërgo email | ✅ |

**Request Body:**
```json
{
  "to": "vesa@scantech.com",
  "subject": "New Task Assigned",
  "message": "You have been assigned a new task: Implement new feature"
}
```

---

## 6️⃣ Middleware dhe Security

### Authentication Middleware (`middleware/auth.js`)
- Verifikon JWT token nga `Authorization: Bearer <token>` header
- Shton `req.user` me të dhënat e përdoruesit
- Kthen 401 nëse token është invalid ose missing

### Authorization Middleware
- Kontrollon nëse përdoruesi ka rol të duhur (team_leader për disa operacione)
- Kontrollon nëse përdoruesi është assignee i task-ut për status updates

### CORS Configuration
- Lejo frontend URL-in për CORS
- Lejo credentials nëse është e nevojshme

---

## 7️⃣ Email Notifications

Kur të krijohen ose ndryshohen task-et, dërgohen email notifications:

1. **Task Created** → Email tek assignee
2. **Task Status Changed to "Completed"** → Email tek team leader
3. **Task Status Changed to "Problematic"** → Email tek team leader me koment
4. **Task Reassigned** → Email tek assignee i ri

**Email Service duhet të:**
- Përdorë Nodemailer për Gmail ose SMTP server tjetër
- Të ketë templates për email-et
- Të jetë async dhe mos ta bllokojë request-in

---

## 8️⃣ Validation dhe Error Handling

### Input Validation
- Përdor express-validator për validim
- Validoni email format, required fields, enum values
- Ktheni error messages të qarta

### Error Handling
- 400 - Bad Request (validation errors)
- 401 - Unauthorized (missing/invalid token)
- 403 - Forbidden (insufficient permissions)
- 404 - Not Found (resource doesn't exist)
- 500 - Internal Server Error

**Error Response Format:**
```json
{
  "success": false,
  "message": "Error message here",
  "errors": [] // Optional validation errors
}
```

---

## 9️⃣ Hapat për Implementim (Rradha e Rekomanduar)

### Hapi 1: Setup Baza
1. Krijo projektin: `mkdir task-management-backend && cd task-management-backend`
2. Initialize npm: `npm init -y`
3. Instalo dependencies
4. Krijo strukturën e direktoriave
5. Krijo `.env` file me variabla
6. Krijo `.gitignore`

### Hapi 2: Database Setup
1. Krijoni database në MySQL
2. Krijoni tabelat me SQL scripts
3. Krijo `config/database.js` për connection pool
4. Testoni connection-in

### Hapi 3: Authentication
1. Krijo `utils/jwt.js` për JWT functions
2. Krijo `utils/password.js` për bcrypt functions
3. Krijo `middleware/auth.js` për JWT verification
4. Krijo `controllers/authController.js` për login/logout
5. Krijo `routes/auth.js`
6. Testoni login/logout

### Hapi 4: Users
1. Krijo `models/User.js` me query functions
2. Krijo `controllers/userController.js`
3. Krijo `routes/users.js`
4. Testoni endpoints

### Hapi 5: Tasks
1. Krijo `models/Task.js` me query functions
2. Krijo `controllers/taskController.js` me të gjitha operacionet
3. Krijo `routes/tasks.js`
4. Implemento authorization logic
5. Testoni të gjitha task endpoints

### Hapi 6: Comments
1. Krijo `models/Comment.js`
2. Krijo `controllers/commentController.js`
3. Krijo `routes/comments.js` ose shto në `routes/tasks.js`
4. Testoni comment endpoints

### Hapi 7: Email Service
1. Krijo `services/emailService.js` me Nodemailer
2. Integro në task controller kur ndodhin ndryshime
3. Testoni email sending

### Hapi 8: Error Handling & Validation
1. Krijo `middleware/errorHandler.js`
2. Shto express-validator në routes
3. Testoni error scenarios

### Hapi 9: Main Server
1. Krijo `server.js` me Express setup
2. Setup CORS, body parser, routes
3. Setup error handling middleware
4. Testoni server-in

### Hapi 10: Testing & Integration
1. Testoni të gjitha endpoints me Postman ose curl
2. Testoni integration me frontend
3. Fix bugs dhe edge cases

---

## 🔟 Pikat Kryesore për Attention

### Security:
- ✅ Hash password-et me bcrypt (minimum 10 rounds)
- ✅ Përdor JWT me expiration time
- ✅ Validoni të gjitha input-et
- ✅ Përdor prepared statements për SQL queries (për SQL injection protection)
- ✅ Mos ekspozoni sensitive data në responses

### Performance:
- ✅ Përdor connection pooling për MySQL
- ✅ Shto indexes në database për queries të shpeshta
- ✅ Paginate results për listat e mëdha
- ✅ Optimizo queries me JOINs kur është e nevojshme

### Code Quality:
- ✅ Organizo kodin në modules
- ✅ Përdor async/await për database operations
- ✅ Handle errors në mënyrë të konsistencuar
- ✅ Shkruaj komente ku është e nevojshme

---

## 📝 Shembuj të Rëndësishëm

### SQL Query Examples:

**Get Tasks me Assignee Info:**
```sql
SELECT 
  t.*,
  u.name as assignee_name,
  u.email as assignee_email,
  c.name as creator_name
FROM tasks t
LEFT JOIN users u ON t.assignee_id = u.id
LEFT JOIN users c ON t.creator_id = c.id
WHERE t.status = 'not_started'
ORDER BY t.created_at DESC;
```

**Get Task me Comments:**
```sql
SELECT 
  t.*,
  u.name as assignee_name,
  u.email as assignee_email,
  JSON_ARRAYAGG(
    JSON_OBJECT(
      'id', cm.id,
      'text', cm.text,
      'userId', cm.user_id,
      'userName', u2.name,
      'createdAt', cm.created_at
    )
  ) as comments
FROM tasks t
LEFT JOIN users u ON t.assignee_id = u.id
LEFT JOIN comments cm ON t.id = cm.task_id
LEFT JOIN users u2 ON cm.user_id = u2.id
WHERE t.id = ?
GROUP BY t.id;
```

---

## ✅ Checklist për Deployment

- [ ] Database është krijuar dhe configured
- [ ] Të gjitha tabelat janë krijuar
- [ ] Seed data për test users është shtuar
- [ ] Environment variables janë konfiguruar
- [ ] CORS është configured për frontend URL
- [ ] Email service është configured
- [ ] Error handling është i plotë
- [ ] Validation është e implementuar
- [ ] Security measures janë në vend
- [ ] Të gjitha endpoints janë testuar
- [ ] Integration me frontend është testuar

---

## 📚 Burime të Dobishme

- **Express.js**: https://expressjs.com/
- **MySQL2**: https://github.com/sidorares/node-mysql2
- **JWT**: https://github.com/auth0/node-jsonwebtoken
- **Bcrypt**: https://github.com/kelektiv/node.bcrypt.js
- **Nodemailer**: https://nodemailer.com/

---

**Gjithë e mira me implementimin! Nëse keni pyetje specifike për ndonjë pjesë, më thoni.**

