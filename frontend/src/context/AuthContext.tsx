import { createContext, useState, useContext, useEffect, ReactNode } from "react";
import { useNavigate } from "react-router-dom";

type UserType = "user" | "doctor" | null;

interface AuthContextType {
  userType: UserType;
  setUserType: (type: UserType) => void;
  isAuthenticated: boolean;
  setIsAuthenticated: (value: boolean) => void;
  userName: string | null;
  setUserName: (name: string | null) => void;
  userId: string | null; // Add userId to the context interface
  logout: () => void;
  login: (userData: any, userType: UserType) => void; // Add login to interface
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [userType, setUserType] = useState<UserType>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [userName, setUserName] = useState<string | null>(localStorage.getItem("userName"));
  const [userId, setUserId] = useState<string | null>(localStorage.getItem("userId")); // Add missing userId state
  
  // Check localStorage on initial load
  useEffect(() => {
    const storedUserType = localStorage.getItem("userType") as UserType;
    const storedUserId = localStorage.getItem("userId");
    const storedUserName = localStorage.getItem("userName");
    
    if (storedUserId) {
      setIsAuthenticated(true);
      setUserType(storedUserType);
      setUserName(storedUserName);
      console.log("Restoring session with userType:", storedUserType, "userName:", storedUserName);
    }
  }, []);
  
  // Add a new method to set userName
  const setAuthUserName = (name: string | null) => {
    setUserName(name);
    if (name) {
      localStorage.setItem("userName", name);
    }
  };
  
  // Clear all auth data
  const logout = () => {
    console.log("Logging out, clearing authentication data");
    localStorage.removeItem("userId");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userName");
    localStorage.removeItem("userType");
    
    setIsAuthenticated(false);
    setUserType(null);
    setUserName(null);
    
    window.location.href = "/login"; // Force a full page reload
  };

  // Make sure to update userName from localStorage on login
  const login = (userData: any, userType: UserType) => {
    // Store user data in localStorage
    localStorage.setItem("userId", userData.id);
    localStorage.setItem("userName", userData.name); // Store the actual name
    localStorage.setItem("userType", userType);
    
    // Update state
    setUserId(userData.id);
    setUserName(userData.name); // Use the name from userData
    setUserType(userType);
    setIsAuthenticated(true); // Also set this
  };
  
  return (
    <AuthContext.Provider
      value={{
        userType,
        setUserType,
        isAuthenticated,
        setIsAuthenticated,
        userName,
        setUserName: setAuthUserName, // Add this new method
        userId, // Add userId to the context
        logout,
        login // Add login to the context
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
