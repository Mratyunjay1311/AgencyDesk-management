import { createContext, useContext, useState } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  // auth = { token, role, agencyId } once select-agency has happened
  const [auth, setAuth] = useState(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    const agencyId = localStorage.getItem("agencyId");
    return token ? { token, role, agencyId } : null;
  })

    function login({ token, role, agencyId }) {
    localStorage.setItem("token", token);
    localStorage.setItem("role", role);
    localStorage.setItem("agencyId", agencyId);
    setAuth({ token, role, agencyId });
  }

  function logout() {
    localStorage.clear();
    setAuth(null);
  }

  return <AuthContext.Provider value={{ auth, login, logout }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}