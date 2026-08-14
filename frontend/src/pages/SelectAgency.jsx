import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function SelectAgency() {
  const [memberships, setMemberships] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();

  useEffect(() => {
    const stored = sessionStorage.getItem("memberships");
    if (!stored) {
      navigate("/login");
      return;
    }
    setMemberships(JSON.parse(stored));
  }, [navigate])
   async function selectMembership(membershipId) {
    setError("");
    try {
      const identityToken = sessionStorage.getItem("identityToken");
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/select-agency`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${identityToken}` },
        body: JSON.stringify({ membershipId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      sessionStorage.removeItem("identityToken");
      sessionStorage.removeItem("memberships");
      login({ token: data.token, role: data.role, agencyId: data.agencyId });
      navigate("/projects");
    } catch (err) {
      setError(err.message);
    }
  }
    return (
    <div style={{ maxWidth: 400, margin: "60px auto", fontFamily: "sans-serif" }}>
      <h2>Choose a workspace</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {memberships.map((m) => (
        <button
          key={m.membershipId}
          onClick={() => selectMembership(m.membershipId)}
          style={{ display: "block", width: "100%", marginBottom: 8, padding: 10, textAlign: "left" }}
        >
          {m.agencyName} — <em>{m.role}</em>
        </button>
      ))}
    </div>
  );
}