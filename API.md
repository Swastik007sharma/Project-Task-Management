# API Documentation

## Base URL

- Local: `http://localhost:5000`

## Authentication

- JWT tokens are returned on register and login.
- For protected routes, send:
  `Authorization: Bearer <token>`
- Auth can also be provided via the `token` httpOnly cookie.

## Health Check

### GET `/`

Returns a simple status message.

Response

```json
"Server is running"
```

## Auth Endpoints (Implemented)

### POST `/api/auth/register`

Register a new user and receive a JWT.

Request Body

```json
{
 "name": "Jane Doe",
 "email": "jane@example.com",
 "password": "strongpassword"
}
```

Response `201`

```json
{
 "message": "User registered successfully",
 "token": "<jwt>",
 "user": {
  "_id": "64f1f7b4f0a1b2c3d4e5f678",
  "name": "Jane Doe",
  "email": "jane@example.com",
  "role": "user"
 }
}
```

Errors

- `400` User already exists
- `500` Server error

### POST `/api/auth/login`

Login and receive a JWT.

Request Body

```json
{
 "email": "jane@example.com",
 "password": "strongpassword"
}
```

Response `200`

```json
{
 "message": "Login successful",
 "token": "<jwt>",
 "user": {
  "_id": "64f1f7b4f0a1b2c3d4e5f678",
  "name": "Jane Doe",
  "email": "jane@example.com",
  "role": "user"
 }
}
```

Errors

- `401` Invalid credentials
- `500` Server error

## Data Enums (Current Models)

- Task `status`: `pending`, `in progress`, `done`
- Task `priority`: `low`, `medium`, `high`
- User `role`: `user`, `admin`

## Implemented Endpoints

### Authorization Notes

- Project write actions (create, update, delete) are restricted to `admin` or the project owner.

### User Profile

- GET `/api/users/me`
- PATCH `/api/users/me`
- GET `/api/users` (admin only)

#### GET `/api/users/me`

Returns the current authenticated user's profile.

Response `200`

```json
{
  "user": {
    "_id": "64f1f7b4f0a1b2c3d4e5f678",
    "name": "Jane Doe",
    "email": "jane@example.com",
    "role": "user"
  }
}
```

#### PATCH `/api/users/me`

Update `name`, `email`, and/or `password`.

Request Body (any subset)

```json
{
  "name": "Jane Updated",
  "email": "jane.updated@example.com",
  "password": "newstrongpassword"
}
```

Response `200`

```json
{
  "message": "Profile updated",
  "user": {
    "_id": "64f1f7b4f0a1b2c3d4e5f678",
    "name": "Jane Updated",
    "email": "jane.updated@example.com",
    "role": "user"
  }
}
```

#### GET `/api/users`

List all users (admin only).

Response `200`

```json
{
  "success": true,
  "count": 2,
  "users": [
    {
      "_id": "64f1f7b4f0a1b2c3d4e5f678",
      "name": "Jane Doe",
      "email": "jane@example.com",
      "role": "user"
    }
  ]
}
```

### Projects

- POST `/api/projects`
- GET `/api/projects`
- GET `/api/projects/:id`
- PATCH `/api/projects/:id`
- DELETE `/api/projects/:id`

#### POST `/api/projects`

Create a project. Owner is the authenticated user.

Request Body

```json
{
  "title": "Website Redesign",
  "description": "Refresh landing page and docs"
}
```

Response `201`

```json
{
  "message": "Project created",
  "project": {
    "_id": "64f1f8c2f0a1b2c3d4e5f999",
    "title": "Website Redesign",
    "description": "Refresh landing page and docs",
    "owner": "64f1f7b4f0a1b2c3d4e5f678",
    "createdAt": "2026-02-05T05:10:00.000Z"
  }
}
```

#### GET `/api/projects`

Admin: all projects. User: only owned projects.

Response `200`

```json
{
  "projects": [
    {
      "_id": "64f1f8c2f0a1b2c3d4e5f999",
      "title": "Website Redesign",
      "description": "Refresh landing page and docs",
      "owner": {
        "_id": "64f1f7b4f0a1b2c3d4e5f678",
        "name": "Jane Doe",
        "email": "jane@example.com",
        "role": "user"
      },
      "createdAt": "2026-02-05T05:10:00.000Z"
    }
  ]
}
```

#### GET `/api/projects/:id`

Admin or owner only.

Response `200`

```json
{
  "project": {
    "_id": "64f1f8c2f0a1b2c3d4e5f999",
    "title": "Website Redesign",
    "description": "Refresh landing page and docs",
    "owner": {
      "_id": "64f1f7b4f0a1b2c3d4e5f678",
      "name": "Jane Doe",
      "email": "jane@example.com",
      "role": "user"
    },
    "createdAt": "2026-02-05T05:10:00.000Z"
  }
}
```

#### PATCH `/api/projects/:id`

Admin or owner only. Update `title` and/or `description`.

Request Body (any subset)

```json
{
  "title": "Website Refresh",
  "description": "Update landing page visuals"
}
```

Response `200`

```json
{
  "message": "Project updated",
  "project": {
    "_id": "64f1f8c2f0a1b2c3d4e5f999",
    "title": "Website Refresh",
    "description": "Update landing page visuals",
    "owner": "64f1f7b4f0a1b2c3d4e5f678",
    "createdAt": "2026-02-05T05:10:00.000Z"
  }
}
```

#### DELETE `/api/projects/:id`

Admin or owner only.

Response `200`

```json
{
  "message": "Project deleted"
}
```

### Tasks

- POST `/api/projects/:projectId/tasks`
- GET `/api/projects/:projectId/tasks`
- GET `/api/projects/:projectId/tasks/stats`
- GET `/api/tasks`
- GET `/api/projects/:projectId/tasks/:taskId`
- PATCH `/api/projects/:projectId/tasks/:taskId`
- DELETE `/api/projects/:projectId/tasks/:taskId`

#### POST `/api/projects/:projectId/tasks`

Create a task under a project. Admin or project owner only.

Request Body

```json
{
  "title": "Design landing page",
  "description": "Create initial hero section",
  "status": "pending",
  "priority": "high",
  "dueDate": "2026-02-20T00:00:00.000Z",
  "assignedTo": "64f1f7b4f0a1b2c3d4e5f678"
}
```

Response `201`

```json
{
  "message": "Task created",
  "task": {
    "_id": "64f1fa11f0a1b2c3d4e5fabc",
    "title": "Design landing page",
    "description": "Create initial hero section",
    "status": "pending",
    "priority": "high",
    "dueDate": "2026-02-20T00:00:00.000Z",
    "project": "64f1f8c2f0a1b2c3d4e5f999",
    "assignedTo": "64f1f7b4f0a1b2c3d4e5f678",
    "createdAt": "2026-02-05T05:20:00.000Z"
  }
}
```

Errors

- `401` Unauthorized
- `403` Forbidden
- `404` Project not found
- `500` Server error

#### GET `/api/projects/:projectId/tasks`

List tasks for a project. Admin or project owner only.

Response `200`

```json
{
  "count": 1,
  "tasks": [
    {
      "_id": "64f1fa11f0a1b2c3d4e5fabc",
      "title": "Design landing page",
      "description": "Create initial hero section",
      "status": "pending",
      "priority": "high",
      "dueDate": "2026-02-20T00:00:00.000Z",
      "project": {
        "_id": "64f1f8c2f0a1b2c3d4e5f999",
        "title": "Website Redesign",
        "owner": "64f1f7b4f0a1b2c3d4e5f678"
      },
      "assignedTo": {
        "_id": "64f1f7b4f0a1b2c3d4e5f678",
        "name": "Jane Doe",
        "email": "jane@example.com",
        "role": "user"
      },
      "createdAt": "2026-02-05T05:20:00.000Z"
    }
  ]
}
```

Errors

- `401` Unauthorized
- `403` Forbidden
- `404` Project not found
- `500` Server error

#### GET `/api/projects/:projectId/tasks/stats`

Get task statistics for a project. Admin or project owner only.

Response `200`

```json
{
  "success": true,
  "projectId": "64f1f8c2f0a1b2c3d4e5f999",
  "total": 12,
  "status": {
    "pending": 5,
    "in progress": 4,
    "done": 3
  },
  "priority": {
    "low": 2,
    "medium": 6,
    "high": 4
  }
}
```

#### GET `/api/tasks`

List tasks for the current user. Admin: all tasks. User: tasks in owned projects.

Response `200`

```json
{
  "success": true,
  "count": 2,
  "tasks": [
    {
      "_id": "64f1fa11f0a1b2c3d4e5fabc",
      "title": "Design landing page",
      "description": "Create initial hero section",
      "status": "pending",
      "priority": "high",
      "project": {
        "_id": "64f1f8c2f0a1b2c3d4e5f999",
        "title": "Website Redesign",
        "owner": "64f1f7b4f0a1b2c3d4e5f678"
      }
    }
  ]
}
```

#### GET `/api/projects/:projectId/tasks/:taskId`

Get a task by id. Admin or project owner only.

Response `200`

```json
{
  "task": {
    "_id": "64f1fa11f0a1b2c3d4e5fabc",
    "title": "Design landing page",
    "description": "Create initial hero section",
    "status": "pending",
    "priority": "high",
    "dueDate": "2026-02-20T00:00:00.000Z",
    "project": {
      "_id": "64f1f8c2f0a1b2c3d4e5f999",
      "title": "Website Redesign",
      "owner": "64f1f7b4f0a1b2c3d4e5f678"
    },
    "assignedTo": {
      "_id": "64f1f7b4f0a1b2c3d4e5f678",
      "name": "Jane Doe",
      "email": "jane@example.com",
      "role": "user"
    }
  }
}
```

Errors

- `401` Unauthorized
- `403` Forbidden
- `404` Task not found
- `404` Task not found in project
- `404` Project not found
- `500` Server error

#### PATCH `/api/projects/:projectId/tasks/:taskId`

Update a task. Admin or project owner only.

Request Body (any subset)

```json
{
  "status": "in progress",
  "priority": "medium"
}
```

Response `200`

```json
{
  "message": "Task updated",
  "task": {
    "_id": "64f1fa11f0a1b2c3d4e5fabc",
    "title": "Design landing page",
    "description": "Create initial hero section",
    "status": "in progress",
    "priority": "medium"
  }
}
```

Errors

- `401` Unauthorized
- `403` Forbidden
- `404` Task not found
- `404` Task not found in project
- `404` Project not found
- `500` Server error

#### DELETE `/api/projects/:projectId/tasks/:taskId`

Delete a task. Admin or project owner only.

Response `200`

```json
{
  "message": "Task deleted"
}
```

Errors

- `401` Unauthorized
- `403` Forbidden
- `404` Task not found
- `404` Task not found in project
- `404` Project not found
- `500` Server error

## Planned Endpoints (Not Implemented Yet)

The routes below are required by the spec but are not yet implemented in the codebase.
