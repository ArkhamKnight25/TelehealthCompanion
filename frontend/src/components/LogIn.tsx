import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { useAuth } from "../context/AuthContext";

type UserType = "user" | "doctor";

const LogIn = () => {
  const [userType, setUserType] = useState<UserType>("user");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { setUserType: setAuthUserType } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Determine which table to query
      const table = userType === "user" ? "Users" : "Doctors";

      // Query the database for a user with matching email
      const { data: userData, error: userError } = await supabase
        .from(table)
        .select("*")
        .eq("email", email)
        .single();

      if (userError) throw new Error("Invalid credentials");

      if (!userData) {
        throw new Error(`No ${userType} account found with this email`);
      }

      // Direct password comparison
      if (password !== userData.password) {
        throw new Error("Invalid credentials");
      }

      // Set user type in context
      setAuthUserType(userType);

      // Store user details in localStorage
      localStorage.setItem("userId", userData.id);
      localStorage.setItem("userEmail", userData.email);
      localStorage.setItem("userName", userData.name);
      localStorage.setItem("userPhone", userData.phone);

      // Redirect to appropriate dashboard
      navigate(
        userType === "user" ? "/patient-dashboard" : "/doctor-dashboard"
      );
    } catch (error) {
      console.error("Login error:", error);
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("An unexpected error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8 flex flex-col items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-4xl font-bold text-gray-800 mb-6 text-center">
          Log In
        </h1>

        {/* User Type Toggle */}
        <div className="flex justify-center mb-6">
          <div className="bg-gray-200 rounded-full p-1 inline-flex">
            <button
              type="button"
              onClick={() => setUserType("user")}
              className={`py-2 px-4 rounded-full ${
                userType === "user"
                  ? "bg-white text-blue-600 shadow"
                  : "text-gray-700"
              }`}
            >
              Patient
            </button>
            <button
              type="button"
              onClick={() => setUserType("doctor")}
              className={`py-2 px-4 rounded-full ${
                userType === "doctor"
                  ? "bg-white text-blue-600 shadow"
                  : "text-gray-700"
              }`}
            >
              Doctor
            </button>
          </div>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label
              htmlFor="email"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition-colors duration-300"
          >
            {loading ? "Logging in..." : "Log In"}
          </button>
        </form>

        <p className="mt-4 text-center text-gray-600">
          Don't have an account?{" "}
          <a href="/signup" className="text-blue-600 hover:underline">
            Sign up
          </a>
        </p>
      </div>
    </div>
  );
};

export default LogIn;
