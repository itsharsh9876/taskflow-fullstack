import { createContext, useContext, useState, useEffect } from "react";

type AuthContextType = {
  user: any;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: any) => {
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("token")
  );

 const [user, setUser] = useState<any>(() => {
  const storedUser = localStorage.getItem("user");
  return storedUser && storedUser !== "undefined"
    ? JSON.parse(storedUser)
    : null;
});

  // 🔹 Keep state synced on refresh
  useEffect(() => {
  const storedUser = localStorage.getItem("user");

  if (storedUser && storedUser !== "undefined") {
    setUser(JSON.parse(storedUser));
  } else {
    setUser(null);
  }
}, []);

  // 🔹 LOGIN
  const login = async (email: string, password: string) => {
    const res = await fetch("http://localhost:5000/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    // ✅ Save token + user
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));

    setToken(data.token);
    setUser(data.user);
  };

  // 🔹 LOGOUT
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext)!;