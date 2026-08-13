import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import apiRequest from "../api";

export default function TaskDetail() {
  const { taskId } = useParams();
  const { auth } = useAuth();
  const isClient = auth.role === "client_user";
  const isStaff = !isClient;

  const [task, setTask] = useState(null);
  const [comments, setComments] = useState([]);
  const [files, setFiles] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [newFile, setNewFile] = useState({ fileName: "", url: "", clientVisible: false });
  const [timeEntry, setTimeEntry] = useState({ durationMinutes: "", note: "", date: "" });
  const [error, setError] = useState("");

    async function loadAll() {
    try {
      setTask(await apiRequest(`/tasks/${taskId}`));
      setComments(await apiRequest(`/tasks/${taskId}/comments`));
      setFiles(await apiRequest(`/tasks/${taskId}/files`));
    } catch (err) {
      setError(err.message);
    }
  }

  useEffect(() => { loadAll(); }, [taskId]);

  async function postComment(e) {
    e.preventDefault();
    await apiRequest(`/tasks/${taskId}/comments`, { method: "POST", body: { body: newComment } });
    setNewComment("");
    loadAll();
  }

    async function uploadFile(e) {
    e.preventDefault();
    await apiRequest(`/tasks/${taskId}/files`, { method: "POST", body: newFile });
    setNewFile({ fileName: "", url: "", clientVisible: false });
    loadAll();
  }

  async function setApproval(fileId, status) {
    await apiRequest(`/files/${fileId}/approval`, { method: "PATCH", body: { approvalStatus: status } });
    loadAll();
  }

  async function logTime(e) {
    e.preventDefault();
    await apiRequest(`/tasks/${taskId}/time-entries`, { method: "POST", body: timeEntry });
    setTimeEntry({ durationMinutes: "", note: "", date: "" });
    alert("Time logged");
  }

    if (!task) return error ? <p style={{ color: "red" }}>{error}</p> : <p>Loading...</p>;

  return (
    <div>
      <h2>{task.title}</h2>
      <p>Status: {task.status} — Priority: {task.priority}</p>

      <h3>Files</h3>
      {files.map((f) => (
        <div key={f._id} style={{ border: "1px solid #ddd", padding: 8, marginBottom: 6 }}>
          <a href={f.url} target="_blank" rel="noreferrer">{f.fileName}</a> — {f.approvalStatus}
          {isClient && f.approvalStatus === "pending" && (
            <span style={{ marginLeft: 8 }}>
              <button onClick={() => setApproval(f._id, "approved")}>Approve</button>
              <button onClick={() => setApproval(f._id, "needs_changes")}>Needs changes</button>
            </span>
          )}
        </div>
      ))}

          {isStaff && (
        <form onSubmit={uploadFile}>
          <input placeholder="File name" value={newFile.fileName} onChange={(e) => setNewFile({ ...newFile, fileName: e.target.value })} />
          <input placeholder="URL" value={newFile.url} onChange={(e) => setNewFile({ ...newFile, url: e.target.value })} />
          <label><input type="checkbox" checked={newFile.clientVisible} onChange={(e) => setNewFile({ ...newFile, clientVisible: e.target.checked })} /> Client visible</label>
          <button type="submit">Upload</button>
        </form>
      )}

      <h3>Comments</h3>
      {comments.map((c) => <p key={c._id}>{c.body}</p>)}
      <form onSubmit={postComment}>
        <input placeholder="Add a comment" value={newComment} onChange={(e) => setNewComment(e.target.value)} style={{ width: "70%" }} />
        <button type="submit">Post</button>
      </form>

     {isStaff && (
        <>
          <h3>Log time</h3>
          <form onSubmit={logTime}>
            <input placeholder="Minutes" type="number" value={timeEntry.durationMinutes} onChange={(e) => setTimeEntry({ ...timeEntry, durationMinutes: e.target.value })} />
            <input placeholder="Note" value={timeEntry.note} onChange={(e) => setTimeEntry({ ...timeEntry, note: e.target.value })} />
            <input type="date" value={timeEntry.date} onChange={(e) => setTimeEntry({ ...timeEntry, date: e.target.value })} />
            <button type="submit">Log</button>
          </form>
        </>
      )}
    </div>
  );
}