import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const MyViewAppointments = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserBookings = async () => {
      const userId = localStorage.getItem('userId') || '65f1dba5f3289c6b25f89bc2';

      try {
        const response = await axios.get(`http://localhost:8001/api/user-bookings/${userId}`);
        setBookings(response.data.bookings);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching bookings:', err);
        setError('Failed to fetch bookings');
        setLoading(false);
        toast.error('Failed to fetch your appointments');
      }
    };

    fetchUserBookings();
  }, []);

  const handleCancelBooking = async (bookingId) => {
    try {
      await axios.put(`http://localhost:8001/api/cancel-booking/${bookingId}`);
      
      // Remove the cancelled booking from the list
      setBookings(bookings.filter(booking => booking._id !== bookingId));
      
      toast.success('Booking cancelled successfully');
    } catch (err) {
      console.error('Error cancelling booking:', err);
      toast.error('Failed to cancel booking');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <h1 className="text-3xl font-bold mb-8 mt-28">My Appointments</h1>
      
      {bookings.length === 0 ? (
        <div className="text-center text-gray-400">
          You have no upcoming appointments.
        </div>
      ) : (
        <div className="grid gap-6">
          {bookings.map((booking) => (
            <div 
              key={booking._id} 
              className="bg-gray-800 rounded-lg p-6 shadow-lg flex justify-between items-center"
            >
              <div>
                <h2 className="text-xl font-semibold mb-2">
                  {booking.apartmentId.title}
                </h2>
                <p className="text-gray-400">
                  Date: {new Date(booking.date).toLocaleDateString()}
                </p>
                <p className="text-gray-400">
                  Time: {booking.timeSlot}
                </p>
                <p className={`font-bold ${
                  booking.status === 'confirmed' ? 'text-green-400' : 
                  booking.status === 'cancelled' ? 'text-red-400' : 'text-yellow-400'
                }`}>
                  Status: {booking.status}
                </p>
              </div>
              {booking.status === 'confirmed' && (
                <button 
                  onClick={() => handleCancelBooking(booking._id)}
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-full transition-colors"
                >
                  Cancel
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyViewAppointments;