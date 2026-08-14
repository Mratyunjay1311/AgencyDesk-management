# AgencyDesk

Multi-tenant client & project management platform for agency-client
work. Built with React, Express, and MongoDB.

## Live demo
- Frontend: https://agency-desk-management.vercel.app/login
- Backend API: https://YOUR-RENDER-URL.onrender.com/api/health

## Tech stack
- **Frontend:** React (Vite), React Router
- **Backend:** Node.js, Express, Mongoose
- **Database:** MongoDB (Atlas)
- **Auth:** JWT, two-step login (identity token → session token)

## Local setup (under 10 minutes)

### 1. Clone and install
```bash
git clone https://github.com/YOUR_USERNAME/agencydesk.git
cd agencydesk

cd backend
npm install
cd ../frontend
npm install
```

### 3. Run both servers (two terminals)
```bash
# Terminal 1
cd backend
npm run dev

# Terminal 2
cd frontend
npm run dev
```

Backend runs on `http://localhost:4000`, frontend on
`http://localhost:5173`.

### 4. Seed sample data (optional but recommended)
```bash
cd backend
npm run seed
```
This creates 2 agencies, an agency_admin and agency_member in each, a
client_user, and a mix of internal/client-visible tasks. See seed
output in the terminal for login credentials.

## Roles
- **agency_admin** — full access within their agency
- **agency_member** — access limited to projects they're assigned to
- **client_user** — access limited to their own client's
  client-visible tasks, comments, and files; can comment and approve
  files, cannot create tasks or change status

## Project structure
