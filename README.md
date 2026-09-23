# Task Hub - Full-Stack CRUD Application

A modern, responsive full-stack task management application with a **FastAPI** REST backend and a **React (Vite)** frontend.

---

## Architecture & Tech Stack

- **Backend**: Python 3.11+, FastAPI, SQLAlchemy, Pydantic v2, SQLite
- **Frontend**: React 18, Vite, Vanilla CSS with custom theme variables
- **API Style**: RESTful JSON API with automatic OpenAPI documentation

---

## API Endpoints

### Health & Meta
* `GET /`: Health check and status confirmation.
* `GET /docs`: Interactive Swagger / OpenAPI documentation UI.

### Analytics
* `GET /api/stats`: Returns task metrics breakdown:
  * `total`: Total number of tasks.
  * `completed`: Tasks with `Completed` status.
  * `in_progress`: Tasks with `In Progress` status.
  * `pending`: Tasks with `Pending` status.
  * `high_priority`: Tasks with `High` priority.

### Tasks CRUD
* `GET /api/tasks`: List tasks with optional query filters:
  * `search` (string): Keyword search across title and description.
  * `category` (string): Filter by task category (e.g. `Work`, `Personal`, `Design`).
  * `status` (string): Filter by status (`Pending`, `In Progress`, `Completed`).
  * `priority` (string): Filter by priority (`Low`, `Medium`, `High`).
  * `skip` (int) / `limit` (int): Pagination controls.
* `GET /api/tasks/{task_id}`: Retrieve a single task by ID.
* `POST /api/tasks`: Create a new task.
  * Body: `TaskCreate` (`title`, `description`, `category`, `priority`, `status`, `due_date`).
* `PUT /api/tasks/{task_id}`: Update an existing task.
  * Body: `TaskUpdate` (optional partial updates to task fields).
* `DELETE /api/tasks/{task_id}`: Delete a task by ID.

---

## Data Models

### Task
| Field | Type | Description |
|---|---|---|
| `id` | Integer | Primary key |
| `title` | String | Task title (required, max 200 chars) |
| `description` | String | Detailed task description (optional) |
| `category` | String | Category tag (default: `Personal`) |
| `priority` | String | Priority level (`Low`, `Medium`, `High`) |
| `status` | String | Current status (`Pending`, `In Progress`, `Completed`) |
| `due_date` | String | Optional due date string |
| `created_at` | DateTime | Timestamp of creation |
| `updated_at` | DateTime | Timestamp of last modification |

---

## Running Locally

### Backend Setup
```bash
cd backend
python -m venv venv
# Windows:
venv\Scripts\activate
# Linux/macOS:
source venv/bin/activate

pip install fastapi uvicorn sqlalchemy pydantic
uvicorn main:app --reload --port 8000
```
Backend runs at `http://localhost:8000`.

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
Frontend runs at `http://localhost:5173`.
