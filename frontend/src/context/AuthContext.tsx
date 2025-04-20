import { createContext, useContext, useEffect, useState } from "react";

type UserType = "user" | "doctor" | null;

type UserDetails = {
  id: string | number;
  name: string;
  email: string;
  phone: string;
  specialisation?: string;
  created_at?: string;
};

type AuthContextType = {
  userType: UserType;
  setUserType: (type: UserType) => void;
  logout: () => void;
  loading: boolean;
  userDetails: UserDetails | null;
  isAuthenticated: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [userType, setUserType] = useState<UserType>(null);
  const [loading, setLoading] = useState(true);
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check if user is already logged in
    const storedUserType = localStorage.getItem("userType") as UserType;
    const userId = localStorage.getItem("userId");

    if (storedUserType && userId) {
      setUserType(storedUserType);
      fetchUserDetails(userId, storedUserType);
      setIsAuthenticated(true);
    }

    setLoading(false);
  }, []);

  const fetchUserDetails = async (userId: string, type: UserType) => {
    try {
      const API_URL = "http://localhost:5000/api";
      const endpoint = type === "user" ? "users" : "doctors";

      const response = await fetch(`${API_URL}/${endpoint}/${userId}`);
      const data = await response.json();

      if (!response.ok) throw new Error(data.error);

      setUserDetails(data);
    } catch (error) {
      console.error("Error fetching user details:", error);
      logout(); // Sign out if there's an error fetching user details
    }
  };

  const logout = () => {
    setUserType(null);
    setUserDetails(null);
    setIsAuthenticated(false);
    localStorage.removeItem("userType");
    localStorage.removeItem("userId");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userName");
  };

  const updateUserType = (type: UserType) => {
    setUserType(type);
    if (type) {
      localStorage.setItem("userType", type);
      const userId = localStorage.getItem("userId");
      if (userId) {
        fetchUserDetails(userId, type);
      }
      setIsAuthenticated(true);
    } else {
      logout();
    }
  };

  return (
    <AuthContext.Provider
      value={{
        userType,
        setUserType: updateUserType,
        logout,
        loading,
        userDetails,
        isAuthenticated,
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
