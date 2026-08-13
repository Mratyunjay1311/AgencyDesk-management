import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import apiRequest from "../api";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

   async function handleSubmit(e) {
  e.preventDefault();
  setError("");
  try {
    const data = await apiRequest("/auth/login", { method: "POST", body: { email, password } });
    sessionStorage.setItem("identityToken", data.identityToken);
    sessionStorage.setItem("memberships", JSON.stringify(data.memberships));
    navigate("/select-agency");
  } catch (err) {
    setError(err.message);
  }
}
    return (
    <div style={{ maxWidth: 360, margin: "60px auto", fontFamily: "sans-serif" }}>
      <h2>Log in</h2>
      <form onSubmit={handleSubmit}>
        <input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} style={{ width: "100%", marginBottom: 8 }} />
        <input placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} style={{ width: "100%", marginBottom: 8 }} />
        {error && <p style={{ color: "red" }}>{error}</p>}
        <button type="submit">Log in</button>
      </form>
      <p><Link to="/register">Create a new agency instead</Link></p>
    </div>
  );
}