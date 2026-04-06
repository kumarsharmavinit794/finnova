import { createContext, useContext, useState, ReactNode } from "react";

const API = import.meta.env.VITE_API_URL;

interface User {
  name: string;
  email: string;
  plan: "basic" | "pro";
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>({
    name: "Bindu",
    email: "rohit@cloudstacklabs.com",
    plan: "pro",
  });

  const login = async (email: string, password: string) => {
    const res = await fetch(`${API}/api/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.detail || "Login failed");
    }

    localStorage.setItem("token", data.access_token);
    setUser(data.user); // Assuming data.user matches the User interface
    // The original code had a hardcoded user, now it will use the user data from the API
    // setUser({ name: "Bindu", email: email, plan: "pro" });
  };

  const register = async (name: string, email: string, _password: string) => {
    await new Promise((r) => setTimeout(r, 1200));
    setUser({ name, email, plan: "basic" });
  };

  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
