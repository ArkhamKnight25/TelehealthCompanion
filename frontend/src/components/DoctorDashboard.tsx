import { useAuth } from '../context/AuthContext';
import { useEffect, useState } from 'react';

const DoctorDashboard = () => {
  const { userName, logout } = useAuth();
  const [displayName, setDisplayName] = useState<string | null>(null);
  
  useEffect(() => {
    // First try to get the name from localStorage directly
    const storedName = localStorage.getItem("userName");
    if (storedName) {
      setDisplayName(storedName);
    }
    
    // Then update from context if/when it becomes available
    if (userName) {
      setDisplayName(userName);
    }
  }, [userName]); // Re-run when userName from context changes
  
  useEffect(() => {
    const userId = localStorage.getItem("userId");
    const userType = localStorage.getItem("userType");
    console.log("Doctor Dashboard mounted - userId:", userId, "userType:", userType);
  }, []);
  
  return (
    <div className="container mx-auto p-4">
      <div className="bg-white shadow-md rounded-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Doctor Dashboard</h1>
          <div className="flex items-center gap-4">
            <span>Welcome, Dr. {displayName || 'Doctor'}</span>
            <button 
              onClick={logout}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
            >
              Logout
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h2 className="text-lg font-semibold mb-3">Today's Appointments</h2>
            <p className="text-gray-500">You have no appointments scheduled for today.</p>
          </div>
          
          <div className="bg-green-50 p-4 rounded-lg">
            <h2 className="text-lg font-semibold mb-3">Patient Queue</h2>
            <p className="text-gray-500">No patients in queue.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorDashboard;