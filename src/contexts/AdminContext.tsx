import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { api, API_URL } from "@/lib/api";

interface AdminContextType {
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  changePassword: (oldPassword: string, newPassword: string) => Promise<{ success: boolean; message?: string }>;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export const AdminProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    // Check if token exists in localStorage for initial state
    // Don't validate yet, just check existence
    return !!localStorage.getItem("token");
  });

  // Validate token on mount (in background, no loading UI)
  useEffect(() => {
    const validateToken = async () => {
      const token = localStorage.getItem("token");
      
      if (!token) {
        setIsAuthenticated(false);
        return;
      }

      // Try to validate token by making a test request to a protected endpoint
      // This runs in background without blocking UI
      try {
        // Test token by trying to access admin endpoint which requires auth
        const testResponse = await fetch(`${API_URL}/admin/packages`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (testResponse.status === 401 || testResponse.status === 403) {
          // Token is invalid or expired, clear it
          localStorage.removeItem("token");
          sessionStorage.removeItem("admin_authenticated");
          setIsAuthenticated(false);
        } else {
          // Token seems valid (even if endpoint returns error, 401/403 is what matters)
          setIsAuthenticated(true);
          sessionStorage.setItem("admin_authenticated", "true");
        }
      } catch (error) {
        // Network error - don't clear token, might be temporary
        // Just set authenticated to false for now
        console.error("Token validation error:", error);
        setIsAuthenticated(false);
      }
    };

    // Run validation in background without blocking
    validateToken();
  }, []);

  const login = async (username: string, password: string): Promise<boolean> => {
    try {
        const response = await api.post("/auth/login", { username, password });
        // Response format from Go: { data: { token: "..." }, message: "..." }
        if (response.data && response.data.token) {
            localStorage.setItem("token", response.data.token);
            sessionStorage.setItem("admin_authenticated", "true");
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
    sessionStorage.removeItem("admin_authenticated");
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
