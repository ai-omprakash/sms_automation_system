import { createContext, useContext, useState } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem("user")); }
    catch { return null; }
  });

  const login = async (usernameOrEmail, password) => {
    try {
      const formData = new URLSearchParams();
      formData.append("username", usernameOrEmail.trim());
      formData.append("password", password);

      const res = await fetch("http://localhost:8000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: formData.toString(),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("token", data.access_token);
        localStorage.setItem("user", JSON.stringify(data.user));
        setUser(data.user);
        return { success: true };
      }
      return { success: false, message: data?.detail || "Invalid credentials." };
    } catch {
      return { success: false, message: "Cannot connect to backend.\n\nMake sure backend is running:\ncd backend\nvenv\\Scripts\\activate\nuvicorn main:app --reload --port 8000" };
    }
  };

  const register = async (payload) => {
    try {
      const res = await fetch("http://localhost:8000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (res.ok) return { success: true };
      const msg = data?.detail || "Registration failed.";
      return { success: false, message: Array.isArray(msg) ? msg.map(m => m.msg).join(", ") : String(msg) };
    } catch {
      return { success: false, message: "Cannot connect to backend. Make sure it is running." };
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
