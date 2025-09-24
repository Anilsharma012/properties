// src/hooks/useAuth.tsx
import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { clearToasts } from "@/hooks/use-toast";

type UserType = "buyer" | "seller" | "agent" | "admin" | "staff";

interface User {
  id?: string;
  _id?: string;
  uid?: string;
  name?: string;
  email?: string;
  phone?: string;
  userType?: UserType;
  role?: string;
  username?: string;
  permissions?: string[];
  roleInfo?: { displayName: string; permissions: string[] };
  isFirstLogin?: boolean;
  lastLogin?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function getUserId(u: any) {
  return u?.id || u?._id || u?.uid || null;
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // ---- migration: if someone saved combined "auth" object ----
    const rawAuth = localStorage.getItem("auth");
    if (rawAuth) {
      try {
        const parsed = JSON.parse(rawAuth);
        if (parsed?.token && parsed?.user && getUserId(parsed.user)) {
          localStorage.setItem("token", parsed.token);
          localStorage.setItem("user", JSON.stringify(parsed.user));
        }
      } catch {}
    }

    // ---- read canonical keys ----
    const storedToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (storedToken && storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        if (storedToken.length > 10 && getUserId(parsedUser)) {
          setToken(storedToken);
          setUser(parsedUser);
        } else {
          throw new Error("Invalid token or user data");
        }
      } catch (error) {
        console.error("Error parsing stored user data:", error);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      }
    }
    setLoading(false);
  }, []);

  const login = (newToken: string, newUser: User) => {
    try { clearToasts(); } catch {}
    localStorage.setItem("token", newToken);
    localStorage.setItem("user", JSON.stringify(newUser));
    setToken(newToken);
    setUser(newUser);
  };

  const logout = () => {
    try { clearToasts(); } catch {}
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token && !!user,
        login,
        logout,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
};
