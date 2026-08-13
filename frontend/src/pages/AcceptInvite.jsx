import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function AcceptInvite() {
  const { token } = useParams();
  const [form, setForm] = useState({ password: "", name: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

   async function accept(e) {
    e.preventDefault();
    try {
      const res = await fetch(`http://localhost:4000/api/invites/${token}/accept`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      alert(`Account ready for ${data.email} as ${data.role}. Please log in.`);
      navigate("/login");
    } catch (err) {
      setError(err.message);
    }
  }

    return (
    <div style={{ maxWidth: 360, margin: "60px auto", fontFamily: "sans-serif" }}>
      <h2>Accept invite</h2>
      <form onSubmit={accept}>
        <input placeholder="Your name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} style={{ width: "100%", marginBottom: 8 }} />
        <input placeholder="Set a password" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} style={{ width: "100%", marginBottom: 8 }} />
        {error && <p style={{ color: "red" }}>{error}</p>}
        <button type="submit">Join</button>
      </form>
    </div>
  );
}