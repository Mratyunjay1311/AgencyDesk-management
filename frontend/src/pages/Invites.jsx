import { useState } from "react";
import apiRequest from "../api";

export default function Invites() {
  const [form, setForm] = useState({ email: "", role: "agency_member" });
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  async function sendInvite(e) {
    e.preventDefault();
    setError("");
    try {
      const data = await apiRequest("/invites", { method: "POST", body: form });
      setResult(data);
    } catch (err) {
      setError(err.message);
    }
  }

    return (
    <div>
      <h2>Invite someone</h2>
      <form onSubmit={sendInvite}>
        <input placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
          <option value="agency_member">agency_member</option>
          <option value="client_user">client_user</option>
        </select>
        <button type="submit">Send invite</button>
      </form>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {result && (
        <p>
          Invite link (share this): <code>/invite/{result.token}</code>
        </p>
      )}
    </div>
  );
}