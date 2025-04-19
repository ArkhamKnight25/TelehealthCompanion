import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

type UserType = "user" | "doctor" | null;

type AuthContextType = {
  userType: UserType;
  setUserType: (type: UserType) => void;
  signOut: () => void;
  loading: boolean;
  userDetails: any | null;
  isAuthenticated: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [userType, setUserType] = useState<UserType>(null);
  const [loading, setLoading] = useState(true);
  const [userDetails, setUserDetails] = useState<any | null>(null);
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
      const table = type === "user" ? "Users" : "Doctors";
      const { data, error } = await supabase
        .from(table)
        .select("*")
        .eq("id", userId)
        .single();

      if (error) throw error;
      setUserDetails(data);
    } catch (error) {
      console.error("Error fetching user details:", error);
      signOut(); // Sign out if there's an error fetching user details
    }
  };

  const signOut = () => {
    setUserType(null);
    setUserDetails(null);
    setIsAuthenticated(false);
    localStorage.removeItem("userType");
    localStorage.removeItem("userId");
    localStorage.removeItem("userPhone");
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
      signOut();
    }
  };

  return (
    <AuthContext.Provider
      value={{
        userType,
        setUserType: updateUserType,
        signOut,
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
