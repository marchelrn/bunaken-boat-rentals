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
  changePassword: (oldPassword: string, newPassword: string) => Promise<{ success: boolean; message?: string }>;
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

  const changePassword = async (oldPassword: string, newPassword: string): Promise<{ success: boolean; message?: string }> => {
    try {
      const response = await api.put("/admin/change-password", {
        old_password: oldPassword,
        new_password: newPassword,
      });
      // Response format from Go: { message: "...", data: ... }
      if (response && response.message) {
        return { success: true, message: response.message };
      }
      return { success: true };
    } catch (error: any) {
      console.error("Change password failed:", error);
      // Extract error message from response
      let errorMessage = "Gagal mengubah password";
      
      // Check if error has response object (from api.ts)
      if (error.response && error.response.message) {
        errorMessage = error.response.message;
      } else if (error.message) {
        // If error.message is already a string, use it
        errorMessage = error.message;
      }
      
      return { success: false, message: errorMessage };
    }
  };

  return (
    <AdminContext.Provider value={{ isAuthenticated, login, logout, changePassword }}>
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
