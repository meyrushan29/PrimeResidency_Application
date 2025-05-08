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

  // Loading state with improved spinner
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-900">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500">
          <div className="h-12 w-12 rounded-full border-t-4 border-b-4 border-blue-300 absolute"></div>
        </div>
      </div>
    );
  }

  // Error state with improved error card
  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 text-white p-6 flex items-center justify-center">
        <div className="bg-gray-800 border-l-4 border-red-500 text-white p-8 rounded-lg shadow-xl max-w-md w-full">
          <h2 className="text-xl font-bold text-red-400 mb-4">Unable to Load Appointments</h2>
          <p className="text-gray-300">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-6 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition w-full"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // No bookings with improved empty state
  if (bookings.length === 0) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-8">
        <div className="bg-gray-800 p-10 rounded-xl shadow-2xl text-center max-w-md w-full">
          <div className="mb-6">
            <svg className="w-20 h-20 mx-auto text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
            </svg>
          </div>
          <h1 className="text-2xl font-bold mb-4">No Appointments Yet</h1>
          <p className="text-gray-400 mb-6">You don't have any scheduled appointments at the moment.</p>
          <Link to="/" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition inline-block">
            Browse Properties
          </Link>
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
      <div className="max-w-6xl mx-auto px-4 py-12">
        <header className="mb-2 mt-32 text-center">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">My Appointments</h1>
          <p className="text-gray-400">Manage all your property viewing appointments in one place</p>
        </header>

        {/* Pending Appointments */}
        {pendingBookings.length > 0 && (
          <div className="mb-12">
            <div className="flex items-center mb-6">
              <div className="h-8 w-2 bg-yellow-500 rounded-r mr-3"></div>
              <h2 className="text-2xl font-semibold text-yellow-300">Pending Appointments</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {pendingBookings.map(booking => (
                <div key={booking._id} className="bg-gray-800 rounded-xl shadow-lg overflow-hidden transform transition hover:translate-y-1 hover:shadow-xl">
                  <div className="h-2 bg-yellow-500 w-full"></div>
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-xl font-bold">{booking.apartmentId?.title || 'Apartment'}</h3>
                        <div className="flex items-center mt-2 text-gray-400">
                          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                          </svg>
                          {new Date(booking.date).toLocaleDateString('en-US', {weekday: 'short', month: 'short', day: 'numeric'})}
                        </div>
                        <div className="flex items-center mt-1 text-gray-400">
                          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                          </svg>
                          {booking.timeSlot}
                        </div>
                      </div>
                      <span className="bg-yellow-600 text-yellow-100 text-sm px-3 py-1 rounded-full font-medium shadow">Pending</span>
                    </div>
                    
                    <div className="border-t border-gray-700 pt-4 mt-4 space-y-2">
                      <div className="flex items-center">
                        <span className="text-gray-400 w-20">Name:</span> 
                        <span className="font-medium">{booking.name}</span>
                      </div>
                      <div className="flex items-center">
                        <span className="text-gray-400 w-20">Phone:</span> 
                        <span className="font-medium">{booking.phoneNumber}</span>
                      </div>
                      <p className="mt-3 text-yellow-300 text-sm italic">This booking is awaiting administrator approval.</p>
                    </div>
                    
                    <div className="flex space-x-3 mt-6">
                      <button 
                        onClick={() => handleEditBooking(booking._id)}
                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition flex items-center justify-center"
                      >
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                        </svg>
                        Edit
                      </button>
                      <button 
                        onClick={() => handleCancelBooking(booking._id)}
                        className="flex-1 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition flex items-center justify-center"
                      >
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                        </svg>
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Upcoming Confirmed Appointments */}
        <div className="mb-12">
          <div className="flex items-center mb-6">
            <div className="h-8 w-2 bg-green-500 rounded-r mr-3"></div>
            <h2 className="text-2xl font-semibold text-green-300">Confirmed Appointments</h2>
          </div>
          {upcomingBookings.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {upcomingBookings.map(booking => (
                <div key={booking._id} className="bg-gray-800 rounded-xl shadow-lg overflow-hidden transform transition hover:translate-y-1 hover:shadow-xl">
                  <div className="h-2 bg-green-500 w-full"></div>
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-xl font-bold">{booking.apartmentId?.title || 'Apartment'}</h3>
                        <div className="flex items-center mt-2 text-gray-400">
                          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                          </svg>
                          {new Date(booking.date).toLocaleDateString('en-US', {weekday: 'short', month: 'short', day: 'numeric'})}
                        </div>
                        <div className="flex items-center mt-1 text-gray-400">
                          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                          </svg>
                          {booking.timeSlot}
                        </div>
                      </div>
                      <span className="bg-green-600 text-green-100 text-sm px-3 py-1 rounded-full font-medium shadow">Confirmed</span>
                    </div>
                    
                    <div className="border-t border-gray-700 pt-4 mt-4 space-y-2">
                      <div className="flex items-center">
                        <span className="text-gray-400 w-20">Name:</span> 
                        <span className="font-medium">{booking.name}</span>
                      </div>
                      <div className="flex items-center">
                        <span className="text-gray-400 w-20">Phone:</span> 
                        <span className="font-medium">{booking.phoneNumber}</span>
                      </div>
                    </div>
                    
                    <div className="flex space-x-3 mt-6">
                      <button 
                        onClick={() => handleEditBooking(booking._id)}
                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition flex items-center justify-center"
                      >
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                        </svg>
                        Edit
                      </button>
                      <button 
                        onClick={() => handleCancelBooking(booking._id)}
                        className="flex-1 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition flex items-center justify-center"
                      >
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                        </svg>
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-gray-800 rounded-xl p-8 text-center">
              <p className="text-gray-400">No confirmed appointments at the moment</p>
            </div>
          )}
        </div>

        {/* Past Appointments */}
        {pastBookings.length > 0 && (
          <div className="mb-12">
            <div className="flex items-center mb-6">
              <div className="h-8 w-2 bg-gray-500 rounded-r mr-3"></div>
              <h2 className="text-2xl font-semibold text-gray-400">Past Appointments</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {pastBookings.map(booking => (
                <div key={booking._id} className="bg-gray-800 bg-opacity-60 rounded-xl shadow-lg overflow-hidden">
                  <div className="h-2 bg-gray-600 w-full"></div>
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-gray-300">{booking.apartmentId?.title || 'Apartment'}</h3>
                        <div className="flex items-center mt-2 text-gray-500">
                          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                          </svg>
                          {new Date(booking.date).toLocaleDateString('en-US', {weekday: 'short', month: 'short', day: 'numeric'})}
                        </div>
                        <div className="flex items-center mt-1 text-gray-500">
                          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                          </svg>
                          {booking.timeSlot}
                        </div>
                      </div>
                      <span className={`${getStatusBadgeClass(booking.status)} text-sm px-3 py-1 rounded-full opacity-75 font-medium`}>
                        {booking.status === 'pending' ? 'Pending' : 'Past'}
                      </span>
                    </div>
                    
                    <div className="border-t border-gray-700 pt-4 mt-4 space-y-2">
                      <div className="flex items-center">
                        <span className="text-gray-500 w-20">Name:</span> 
                        <span className="font-medium text-gray-300">{booking.name}</span>
                      </div>
                      <div className="flex items-center">
                        <span className="text-gray-500 w-20">Phone:</span> 
                        <span className="font-medium text-gray-300">{booking.phoneNumber}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Cancelled Appointments */}
        {cancelledBookings.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center mb-6">
              <div className="h-8 w-2 bg-red-500 rounded-r mr-3"></div>
              <h2 className="text-2xl font-semibold text-red-300">Cancelled Appointments</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {cancelledBookings.map(booking => (
                <div key={booking._id} className="bg-gray-800 bg-opacity-50 rounded-xl shadow-lg overflow-hidden">
                  <div className="h-2 bg-red-600 w-full"></div>
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-gray-400">{booking.apartmentId?.title || 'Apartment'}</h3>
                        <div className="flex items-center mt-2 text-gray-500">
                          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                          </svg>
                          {new Date(booking.date).toLocaleDateString('en-US', {weekday: 'short', month: 'short', day: 'numeric'})}
                        </div>
                        <div className="flex items-center mt-1 text-gray-500">
                          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                          </svg>
                          {booking.timeSlot}
                        </div>
                      </div>
                      <span className="bg-red-600 bg-opacity-50 text-red-200 text-sm px-3 py-1 rounded-full font-medium">Cancelled</span>
                    </div>
                    
                    <div className="border-t border-gray-700 pt-4 mt-4 space-y-2">
                      <div className="flex items-center">
                        <span className="text-gray-500 w-20">Name:</span> 
                        <span className="font-medium text-gray-400">{booking.name}</span>
                      </div>
                      <div className="flex items-center">
                        <span className="text-gray-500 w-20">Phone:</span> 
                        <span className="font-medium text-gray-400">{booking.phoneNumber}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        <div className="text-center mt-12">
          <Link to="/" className="inline-flex items-center text-blue-400 hover:text-blue-300 transition">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
            </svg>
            Back to Homepage
          </Link>
        </div>
      </div>
    </div>
  );
};

export default MyAppointments;