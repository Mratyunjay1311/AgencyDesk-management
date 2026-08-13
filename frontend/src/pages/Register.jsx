import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import apiRequest from "../api";

export default function Register() {
  const [form, setForm] = useState({ email: "", password: "", name: "", agencyName: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    try {
      const data = await apiRequest("/auth/register", { method: "POST", body: form });
      login({ token: data.token, role: data.role, agencyId: data.agency.id });
      navigate("/projects");
    } catch (err) {
      setError(err.message);
    }
  }
    return (
    <div style={{ maxWidth: 360, margin: "60px auto", fontFamily: "sans-serif" }}>
      <h2>Create your agency</h2>
      <form onSubmit={handleSubmit}>
        {["email", "password", "name", "agencyName"].map((field) => (
          <input
            key={field}
            placeholder={field}
            type={field === "password" ? "password" : "text"}
            value={form[field]}
            onChange={(e) => setForm({ ...form, [field]: e.target.value })}
            style={{ width: "100%", marginBottom: 8 }}
          />
        ))}
        {error && <p style={{ color: "red" }}>{error}</p>}
        <button type="submit">Create agency</button>
      </form>
    </div>
  );
}