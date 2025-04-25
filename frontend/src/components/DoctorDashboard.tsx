import { useAuth } from '../context/AuthContext';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API_URL from '../services/api';

interface Booking {
  id: number;
  appointment_time: string;
  address: string;
  test_type: string;
  user_id: number;
  Users?: {
    id: number;
    name: string;
    email: string;
    phone: string;
  } | null;
}

const DoctorDashboard = () => {
  const { userName, logout } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loadingBookings, setLoadingBookings] = useState(false);
  const navigate = useNavigate();
  
  // Fetch doctor's bookings
  useEffect(() => {
    const fetchDoctorBookings = async () => {
      const doctorId = localStorage.getItem("userId");
      if (!doctorId) return;
      
      setLoadingBookings(true);
      try {
        console.log(`Fetching bookings for doctor ${doctorId} from ${API_URL}/bookings/doctor/${doctorId}`);
        
        // Fetch bookings assigned to this doctor (try both endpoint formats)
        const url = `${API_URL}/bookings/doctor/${doctorId}`;
        console.log("Fetching from URL:", url);
        
        const response = await fetch(url);
        console.log("Response status:", response.status);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch bookings: ${response.status}`);
        }
        
        const data = await response.json();
        console.log("Doctor bookings:", data);
        setBookings(data);
      } catch (error) {
        console.error("Error fetching bookings:", error);
      } finally {
        setLoadingBookings(false);
      }
    };
    
    fetchDoctorBookings();
  }, []);
  
  // Format date for display
  const formatDateTime = (dateTimeStr: string) => {
    const date = new Date(dateTimeStr);
    return date.toLocaleString();
  };
  
  return (
    <div className="container mx-auto p-4">
      <div className="bg-white shadow-md rounded-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Doctor Dashboard</h1>
          <div className="flex items-center gap-4">
            <span>Welcome, Dr. {userName || 'Doctor'}</span>
            <button 
              onClick={logout}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
            >
              Logout
            </button>
          </div>
        </div>
        
        {/* Bookings Section */}
        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-4">Your Patient Appointments</h2>
          
          {loadingBookings ? (
            <div className="flex justify-center p-4">
              <p>Loading your appointments...</p>
            </div>
          ) : bookings.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white">
                <thead>
                  <tr>
                    <th className="py-2 px-4 border-b text-left">Date & Time</th>
                    <th className="py-2 px-4 border-b text-left">Patient Name</th>
                    <th className="py-2 px-4 border-b text-left">Contact</th>
                    <th className="py-2 px-4 border-b text-left">Test/Service</th>
                    <th className="py-2 px-4 border-b text-left">Address</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((booking) => (
                    <tr key={booking.id}>
                      <td className="py-2 px-4 border-b">{formatDateTime(booking.appointment_time)}</td>
                      <td className="py-2 px-4 border-b">{booking.Users?.name || 'Unknown Patient'}</td>
                      <td className="py-2 px-4 border-b">
                        {booking.Users ? (
                          <div>
                            <div>{booking.Users.email}</div>
                            <div>{booking.Users.phone}</div>
                          </div>
                        ) : 'No contact info'}
                      </td>
                      <td className="py-2 px-4 border-b">{booking.test_type}</td>
                      <td className="py-2 px-4 border-b">{booking.address}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="bg-gray-50 p-6 rounded-lg text-center">
              <p className="text-gray-600">You don't have any scheduled appointments yet.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DoctorDashboard;