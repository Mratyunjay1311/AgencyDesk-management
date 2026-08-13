import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import apiRequest from "../api";

export default function Projects() {
  const { auth } = useAuth();
  const isAdmin = auth.role === "agency_admin";

  const [clients, setClients] = useState([]);
  const [projects, setProjects] = useState([]);
  const [newClientName, setNewClientName] = useState("");
  const [newProject, setNewProject] = useState({ name: "", clientId: "" });
  const [error, setError] = useState("");

   async function loadAll() {
    try {
      const projectData = await apiRequest("/projects");
      setProjects(projectData);
      if (isAdmin) {
        const clientData = await apiRequest("/clients");
        setClients(clientData);
      }
    } catch (err) {
      setError(err.message);
    }
  }
  useEffect(() => { loadAll(); }, []);

  async function createClient(e) {
    e.preventDefault();
    await apiRequest("/clients", { method: "POST", body: { name: newClientName } });
    setNewClientName("");
    loadAll();
  }

  async function createProject(e) {
    e.preventDefault();
    await apiRequest("/projects", { method: "POST", body: newProject });
    setNewProject({ name: "", clientId: "" });
    loadAll();
  }

    return (
    <div>
      <h2>Projects</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}

      {projects.map((p) => (
        <div key={p._id} style={{ border: "1px solid #ddd", padding: 10, marginBottom: 8 }}>
          <Link to={`/projects/${p._id}`}>{p.name}</Link>
        </div>
      ))}

        {isAdmin && (
        <>
          <hr />
          <h3>New client</h3>
          <form onSubmit={createClient}>
            <input placeholder="Client name" value={newClientName} onChange={(e) => setNewClientName(e.target.value)} />
            <button type="submit">Add client</button>
          </form>
             <h3>New project</h3>
          <form onSubmit={createProject}>
            <input placeholder="Project name" value={newProject.name} onChange={(e) => setNewProject({ ...newProject, name: e.target.value })} />
            <select value={newProject.clientId} onChange={(e) => setNewProject({ ...newProject, clientId: e.target.value })}>
              <option value="">Select client</option>
              {clients.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
            </select>
            <button type="submit">Add project</button>
          </form>
        </>
      )}
    </div>
  );
}