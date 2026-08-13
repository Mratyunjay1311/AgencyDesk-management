import { BrowserRouter, Routes, Route, Navigate, Link } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Login from "./pages/Login";
import Register from "./pages/Register";
import SelectAgency from "./pages/SelectAgency";
import Projects from "./pages/Projects";
import ProjectDetail from "./pages/ProjectDetail";
import TaskDetail from "./pages/TaskDetail";
import Invites from "./pages/Invites";
import AcceptInvite from "./pages/AcceptInvite";

function RequireAuth({ children }) {
  const { auth } = useAuth();
  if (!auth) return <Navigate to="/login" replace />;
  return children;
}

function Layout({ children }) {
  const { auth, logout } = useAuth();
  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: 20, fontFamily: "sans-serif" }}>
      <nav style={{ display: "flex", gap: 16, marginBottom: 20, borderBottom: "1px solid #ddd", paddingBottom: 10 }}>
        <Link to="/projects">Projects</Link>
        {auth?.role === "agency_admin" && <Link to="/invites">Invites</Link>}
        {auth && <button onClick={logout} style={{ marginLeft: "auto" }}>Logout</button>}
        {auth && <span style={{ color: "#888" }}>role: {auth.role}</span>}
      </nav>
      {children}
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/select-agency" element={<SelectAgency />} />
          <Route path="/invite/:token" element={<AcceptInvite />} />

          <Route path="/projects" element={<RequireAuth><Layout><Projects /></Layout></RequireAuth>} />
          <Route path="/projects/:projectId" element={<RequireAuth><Layout><ProjectDetail /></Layout></RequireAuth>} />
          <Route path="/tasks/:taskId" element={<RequireAuth><Layout><TaskDetail /></Layout></RequireAuth>} />
          <Route path="/invites" element={<RequireAuth><Layout><Invites /></Layout></RequireAuth>} />

          <Route path="*" element={<Navigate to="/projects" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}