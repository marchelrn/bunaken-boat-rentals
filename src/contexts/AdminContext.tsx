import {
  createContext,
  useContext,
  useState,
  ReactNode,
} from "react";
import { api } from "@/lib/api";

interface AdminContextType {
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export const AdminProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return !!localStorage.getItem("token");
  });

  const login = async (username: string, password: string): Promise<boolean> => {
    try {
        const response = await api.post("/auth/login", { username, password });
        // Response format from Go: { data: { token: "..." }, message: "..." }
        if (response.data && response.data.token) {
            localStorage.setItem("token", response.data.token);
            setIsAuthenticated(true);
            return true;
        }
        return false;
    } catch (error) {
        console.error("Login failed:", error);
        return false;
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem("token");
  };

  return (
    <AdminContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (context === undefined) {
    throw new Error("useAdmin must be used within an AdminProvider");
  }
  return context;
};
