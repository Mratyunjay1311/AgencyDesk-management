import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import apiRequest from "../api";

export default function ProjectDetail() {
  const { projectId } = useParams();
  const { auth } = useAuth();
  const canCreateTask = auth.role === "agency_admin" || auth.role === "agency_member";

  const [tasks, setTasks] = useState([]);
  const [dashboard, setDashboard] = useState(null);
  const [newTask, setNewTask] = useState({ title: "", clientVisible: false });
  const [error, setError] = useState("");

  async function loadAll() {
    try {
      setTasks(await apiRequest(`/projects/${projectId}/tasks`));
      setDashboard(await apiRequest(`/projects/${projectId}/dashboard`));
    } catch (err) {
      setError(err.message);
    }
  }

  useEffect(() => { loadAll(); }, [projectId]);

  async function createTask(e) {
    e.preventDefault();
    await apiRequest(`/projects/${projectId}/tasks`, { method: "POST", body: newTask });
    setNewTask({ title: "", clientVisible: false });
    loadAll();
  }

   return (
    <div>
      <h2>Project</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}

      {dashboard && (
        <div style={{ background: "#f5f5f5", padding: 10, marginBottom: 16 }}>
          <strong>Task counts:</strong> {JSON.stringify(dashboard.taskCountsByStatus)}
          {dashboard.totalHoursLogged !== undefined && <div>Hours logged: {dashboard.totalHoursLogged}</div>}
        </div>
      )}

      {tasks.map((t) => (
        <div key={t._id} style={{ border: "1px solid #ddd", padding: 10, marginBottom: 6 }}>
          <Link to={`/tasks/${t._id}`}>{t.title}</Link> — {t.status} {t.clientVisible ? "🌐" : "🔒"}
        </div>
      ))}

         {canCreateTask && (
        <form onSubmit={createTask} style={{ marginTop: 16 }}>
          <input placeholder="Task title" value={newTask.title} onChange={(e) => setNewTask({ ...newTask, title: e.target.value })} />
          <label style={{ marginLeft: 8 }}>
            <input type="checkbox" checked={newTask.clientVisible} onChange={(e) => setNewTask({ ...newTask, clientVisible: e.target.checked })} />
            Client visible
          </label>
          <button type="submit">Add task</button>
        </form>
      )}
    </div>
  );
}