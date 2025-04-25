import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const MyAppointments = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  
  useEffect(() => {
    const fetchUserBookings = async () => {
      const userId = localStorage.getItem('userId') || '65f1dba5f3289c6b25f89bc2';
      
      try {
        setLoading(true);
        const response = await axios.get(`http://localhost:8001/api/user-bookings/${userId}`);
        
        if (!response.data || !response.data.bookings) {
          throw new Error('Failed to fetch bookings');
        }
        
        setBookings(response.data.bookings);
      } catch (err) {
        console.error('Error fetching bookings:', err);
        setError('Failed to load your appointments');
      } finally {
        setLoading(false);
      }
    };

    fetchUserBookings();
  }, []);

  const handleCancelBooking = async (bookingId) => {
    try {
      const response = await axios.put(`http://localhost:8001/api/cancel-booking/${bookingId}`);
      
      toast.success('Booking cancelled successfully');
      
      // Update the local state to reflect the cancellation
      setBookings(prevBookings => 
        prevBookings.map(booking => 
          booking._id === bookingId 
            ? { ...booking, status: 'cancelled' } 
            : booking
        )
      );
    } catch (err) {
      console.error('Cancel booking failed:', err);
      toast.error('Failed to cancel booking');
    }
  };

  const handleEditBooking = (bookingId) => {
    navigate(`/edit-booking/${bookingId}`);
  };

  // Helper function to check if booking is in the past
  const isBookingInPast = (booking) => {
    const today = new Date();
    const bookingDate = new Date(booking.date);
    
    // Set booking time from timeSlot
    if (booking.timeSlot) {
      const [hours, minutes] = booking.timeSlot.split(':').map(Number);
      if (!isNaN(hours) && !isNaN(minutes)) {
        bookingDate.setHours(hours, minutes, 0, 0);
      }
    }
    
    return bookingDate < today;
  };

  // Helper function to get status badge color
  const getStatusBadgeClass = (status) => {
    switch(status) {
      case 'confirmed':
        return 'bg-green-600';
      case 'pending':
        return 'bg-yellow-600';
      case 'cancelled':
        return 'bg-red-600';
      default:
        return 'bg-gray-600';
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 text-white p-6">
        <div className="bg-red-900 border-l-4 border-red-500 text-white p-4 mb-4 rounded">
          <p className="font-bold">Error</p>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  // No bookings
  if (bookings.length === 0) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-8">
        <h1 className="text-3xl font-bold mb-6">My Appointments</h1>
        <div className="bg-gray-800 p-8 rounded-lg shadow-lg text-center max-w-md w-full">
          <p className="text-lg text-gray-300 mb-4">You don't have any appointments yet</p>
        </div>
      </div>
    );
  }

  // Group bookings by status and time
  const pendingBookings = bookings.filter(booking => 
    booking.status === 'pending' && !isBookingInPast(booking)
  );
  
  const upcomingBookings = bookings.filter(booking => 
    booking.status === 'confirmed' && !isBookingInPast(booking)
  );
  
  const pastBookings = bookings.filter(booking => 
    (booking.status === 'confirmed' || booking.status === 'pending') && isBookingInPast(booking)
  );
  
  const cancelledBookings = bookings.filter(booking => 
    booking.status === 'cancelled'
  );

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="max-w-6xl mx-auto p-4">
        <h1 className="text-3xl font-bold mb-6 mt-44">My Appointments</h1>

        {/* Pending Appointments */}
        {pendingBookings.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-yellow-300">Pending Appointments</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {pendingBookings.map(booking => (
                <div key={booking._id} className="bg-gray-800 rounded-lg shadow-lg p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-semibold">{booking.apartmentId?.title || 'Apartment'}</h3>
                      <p className="text-gray-400">{new Date(booking.date).toLocaleDateString()} at {booking.timeSlot}</p>
                    </div>
                    <span className="bg-yellow-600 text-sm px-3 py-1 rounded-full">Pending</span>
                  </div>
                  
                  <div className="border-t border-gray-700 pt-4 mt-4">
                    <p><span className="text-gray-400">Name:</span> {booking.name}</p>
                    <p><span className="text-gray-400">Phone:</span> {booking.phoneNumber}</p>
                    <p className="mt-2 text-yellow-300 text-sm">This booking is waiting for admin approval.</p>
                  </div>
                  
                  <div className="flex space-x-3 mt-4">
                    <button 
                      onClick={() => handleEditBooking(booking._id)}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition"
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => handleCancelBooking(booking._id)}
                      className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded transition"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Upcoming Confirmed Appointments */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-blue-300">Confirmed Appointments</h2>
          {upcomingBookings.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {upcomingBookings.map(booking => (
                <div key={booking._id} className="bg-gray-800 rounded-lg shadow-lg p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-semibold">{booking.apartmentId?.title || 'Apartment'}</h3>
                      <p className="text-gray-400">{new Date(booking.date).toLocaleDateString()} at {booking.timeSlot}</p>
                    </div>
                    <span className="bg-green-600 text-sm px-3 py-1 rounded-full">Confirmed</span>
                  </div>
                  
                  <div className="border-t border-gray-700 pt-4 mt-4">
                    <p><span className="text-gray-400">Name:</span> {booking.name}</p>
                    <p><span className="text-gray-400">Phone:</span> {booking.phoneNumber}</p>
                  </div>
                  
                  <div className="flex space-x-3 mt-4">
                    <button 
                      onClick={() => handleEditBooking(booking._id)}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition"
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => handleCancelBooking(booking._id)}
                      className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded transition"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-400">No confirmed appointments</p>
          )}
        </div>

        {/* Past Appointments */}
        {pastBookings.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-gray-400">Past Appointments</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {pastBookings.map(booking => (
                <div key={booking._id} className="bg-gray-800 rounded-lg shadow-lg p-6 opacity-75">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-semibold">{booking.apartmentId?.title || 'Apartment'}</h3>
                      <p className="text-gray-400">{new Date(booking.date).toLocaleDateString()} at {booking.timeSlot}</p>
                    </div>
                    <span className={`${getStatusBadgeClass(booking.status)} text-sm px-3 py-1 rounded-full`}>
                      {booking.status === 'pending' ? 'Pending' : 'Past'}
                    </span>
                  </div>
                  
                  <div className="border-t border-gray-700 pt-4 mt-4">
                    <p><span className="text-gray-400">Name:</span> {booking.name}</p>
                    <p><span className="text-gray-400">Phone:</span> {booking.phoneNumber}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Cancelled Appointments */}
        {cancelledBookings.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-red-300">Cancelled Appointments</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {cancelledBookings.map(booking => (
                <div key={booking._id} className="bg-gray-800 rounded-lg shadow-lg p-6 opacity-60">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-semibold">{booking.apartmentId?.title || 'Apartment'}</h3>
                      <p className="text-gray-400">{new Date(booking.date).toLocaleDateString()} at {booking.timeSlot}</p>
                    </div>
                    <span className="bg-red-600 text-sm px-3 py-1 rounded-full">Cancelled</span>
                  </div>
                  
                  <div className="border-t border-gray-700 pt-4 mt-4">
                    <p><span className="text-gray-400">Name:</span> {booking.name}</p>
                    <p><span className="text-gray-400">Phone:</span> {booking.phoneNumber}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      
      </div>
    </div>
  );
};

export default MyAppointments;