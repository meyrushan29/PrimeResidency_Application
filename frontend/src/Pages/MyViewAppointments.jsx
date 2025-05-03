import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Calendar, Clock, MapPin, Edit, X, ChevronLeft, CheckCircle, AlertTriangle, Clock3, Layers } from 'lucide-react';

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
        return 'bg-emerald-100 text-emerald-700 border border-emerald-200';
      case 'pending':
        return 'bg-amber-100 text-amber-700 border border-amber-200';
      case 'cancelled':
        return 'bg-red-100 text-red-700 border border-red-200';
      default:
        return 'bg-gray-100 text-gray-700 border border-gray-200';
    }
  };

  // Loading state with improved spinner
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 border-4 border-t-blue-600 border-b-blue-600 border-l-transparent border-r-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-gray-700 font-medium">Loading your appointments...</p>
        </div>
      </div>
    );
  }

  // Error state with improved error card
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
        <div className="bg-white border-l-4 border-red-500 p-8 rounded-lg shadow-xl max-w-md w-full">
          <h2 className="text-xl font-bold text-red-600 mb-4">Unable to Load Appointments</h2>
          <p className="text-gray-600">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-6 bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg transition w-full font-medium"
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
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-8">
        <div className="bg-white p-10 rounded-xl shadow-lg text-center max-w-md w-full border border-gray-200">
          <div className="mb-6">
            <Calendar className="w-20 h-20 mx-auto text-gray-300 stroke-1" />
          </div>
          <h1 className="text-2xl font-bold mb-4 text-gray-800">No Appointments Yet</h1>
          <p className="text-gray-600 mb-6">You don't have any scheduled appointments at the moment.</p>
          <Link to="/" className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-3 rounded-lg transition inline-block font-medium shadow-md">
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
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="max-w-6xl mx-auto px-4 py-12 pt-32">
        <header className="mb-12 text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-700">My Appointments</h1>
          <p className="text-gray-600">Manage all your property viewing appointments in one place</p>
        </header>

        {/* Pending Appointments */}
        {pendingBookings.length > 0 && (
          <div className="mb-12">
            <div className="flex items-center mb-6">
              <div className="h-8 w-2 bg-amber-500 rounded-r mr-3"></div>
              <h2 className="text-2xl font-bold text-gray-800">Pending Appointments</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {pendingBookings.map(booking => (
                <div key={booking._id} className="bg-white rounded-xl shadow-md overflow-hidden transform transition-all duration-300 hover:-translate-y-1 hover:shadow-lg border border-gray-100">
                  <div className="h-2 bg-amber-500 w-full"></div>
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-gray-800">{booking.apartmentId?.title || 'Apartment'}</h3>
                        <div className="flex items-center mt-2 text-gray-500">
                          <Calendar className="w-4 h-4 mr-2 stroke-2" />
                          {new Date(booking.date).toLocaleDateString('en-US', {weekday: 'short', month: 'short', day: 'numeric'})}
                        </div>
                        <div className="flex items-center mt-1 text-gray-500">
                          <Clock className="w-4 h-4 mr-2 stroke-2" />
                          {booking.timeSlot}
                        </div>
                      </div>
                      <span className="bg-amber-100 text-amber-700 text-sm px-3 py-1.5 rounded-full font-medium shadow-sm border border-amber-200">
                        <span className="inline-block mr-1 w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
                        Pending
                      </span>
                    </div>
                    
                    <div className="border-t border-gray-100 pt-4 mt-4 space-y-2">
                      <div className="flex items-center">
                        <span className="text-gray-500 w-20">Name:</span> 
                        <span className="font-medium text-gray-800">{booking.name}</span>
                      </div>
                      <div className="flex items-center">
                        <span className="text-gray-500 w-20">Phone:</span> 
                        <span className="font-medium text-gray-800">{booking.phoneNumber}</span>
                      </div>
                      <p className="mt-3 text-amber-600 text-sm bg-amber-50 p-2 rounded-lg border border-amber-100">
                        <AlertTriangle className="w-4 h-4 inline-block mr-2 stroke-2" />
                        This booking is awaiting administrator approval.
                      </p>
                    </div>
                    
                    <div className="flex space-x-3 mt-6">
                      <button 
                        onClick={() => handleEditBooking(booking._id)}
                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg transition flex items-center justify-center font-medium shadow-sm"
                      >
                        <Edit className="w-4 h-4 mr-2 stroke-2" />
                        Edit
                      </button>
                      <button 
                        onClick={() => handleCancelBooking(booking._id)}
                        className="flex-1 bg-white hover:bg-red-50 text-red-600 border border-red-200 px-4 py-3 rounded-lg transition flex items-center justify-center font-medium"
                      >
                        <X className="w-4 h-4 mr-2 stroke-2" />
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
            <div className="h-8 w-2 bg-emerald-500 rounded-r mr-3"></div>
            <h2 className="text-2xl font-bold text-gray-800">Confirmed Appointments</h2>
          </div>
          {upcomingBookings.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {upcomingBookings.map(booking => (
                <div key={booking._id} className="bg-white rounded-xl shadow-md overflow-hidden transform transition-all duration-300 hover:-translate-y-1 hover:shadow-lg border border-gray-100">
                  <div className="h-2 bg-emerald-500 w-full"></div>
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-gray-800">{booking.apartmentId?.title || 'Apartment'}</h3>
                        <div className="flex items-center mt-2 text-gray-500">
                          <Calendar className="w-4 h-4 mr-2 stroke-2" />
                          {new Date(booking.date).toLocaleDateString('en-US', {weekday: 'short', month: 'short', day: 'numeric'})}
                        </div>
                        <div className="flex items-center mt-1 text-gray-500">
                          <Clock className="w-4 h-4 mr-2 stroke-2" />
                          {booking.timeSlot}
                        </div>
                      </div>
                      <span className="bg-emerald-100 text-emerald-700 text-sm px-3 py-1.5 rounded-full font-medium shadow-sm border border-emerald-200">
                        <CheckCircle className="w-3 h-3 inline-block mr-1 stroke-2" />
                        Confirmed
                      </span>
                    </div>
                    
                    <div className="border-t border-gray-100 pt-4 mt-4 space-y-2">
                      <div className="flex items-center">
                        <span className="text-gray-500 w-20">Name:</span> 
                        <span className="font-medium text-gray-800">{booking.name}</span>
                      </div>
                      <div className="flex items-center">
                        <span className="text-gray-500 w-20">Phone:</span> 
                        <span className="font-medium text-gray-800">{booking.phoneNumber}</span>
                      </div>
                      <div className="flex items-center mt-2">
                        <span className="text-gray-500 w-20">Location:</span> 
                        <span className="font-medium text-gray-800 flex items-center">
                          <MapPin className="w-4 h-4 mr-1 text-emerald-500 stroke-2" />
                          {booking.apartmentId?.location || 'Contact for details'}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex space-x-3 mt-6">
                      <button 
                        onClick={() => handleEditBooking(booking._id)}
                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg transition flex items-center justify-center font-medium shadow-sm"
                      >
                        <Edit className="w-4 h-4 mr-2 stroke-2" />
                        Edit
                      </button>
                      <button 
                        onClick={() => handleCancelBooking(booking._id)}
                        className="flex-1 bg-white hover:bg-red-50 text-red-600 border border-red-200 px-4 py-3 rounded-lg transition flex items-center justify-center font-medium"
                      >
                        <X className="w-4 h-4 mr-2 stroke-2" />
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-xl p-8 text-center shadow-md border border-gray-100">
              <Clock3 className="w-12 h-12 mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500">No confirmed appointments at the moment</p>
            </div>
          )}
        </div>

        {/* Past Appointments */}
        {pastBookings.length > 0 && (
          <div className="mb-12">
            <div className="flex items-center mb-6">
              <div className="h-8 w-2 bg-gray-400 rounded-r mr-3"></div>
              <h2 className="text-2xl font-bold text-gray-800">Past Appointments</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {pastBookings.map(booking => (
                <div key={booking._id} className="bg-white bg-opacity-60 rounded-xl shadow-sm overflow-hidden border border-gray-200">
                  <div className="h-2 bg-gray-300 w-full"></div>
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-gray-600">{booking.apartmentId?.title || 'Apartment'}</h3>
                        <div className="flex items-center mt-2 text-gray-500">
                          <Calendar className="w-4 h-4 mr-2 stroke-2" />
                          {new Date(booking.date).toLocaleDateString('en-US', {weekday: 'short', month: 'short', day: 'numeric'})}
                        </div>
                        <div className="flex items-center mt-1 text-gray-500">
                          <Clock className="w-4 h-4 mr-2 stroke-2" />
                          {booking.timeSlot}
                        </div>
                      </div>
                      <span className={`${getStatusBadgeClass(booking.status)} text-sm px-3 py-1 rounded-full font-medium`}>
                        {booking.status === 'pending' ? 'Expired' : 'Past'}
                      </span>
                    </div>
                    
                    <div className="border-t border-gray-100 pt-4 mt-4 space-y-2">
                      <div className="flex items-center">
                        <span className="text-gray-400 w-20">Name:</span> 
                        <span className="font-medium text-gray-600">{booking.name}</span>
                      </div>
                      <div className="flex items-center">
                        <span className="text-gray-400 w-20">Phone:</span> 
                        <span className="font-medium text-gray-600">{booking.phoneNumber}</span>
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
              <h2 className="text-2xl font-bold text-gray-800">Cancelled Appointments</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {cancelledBookings.map(booking => (
                <div key={booking._id} className="bg-white bg-opacity-60 rounded-xl shadow-sm overflow-hidden border border-gray-200">
                  <div className="h-2 bg-red-300 w-full"></div>
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-gray-600">{booking.apartmentId?.title || 'Apartment'}</h3>
                        <div className="flex items-center mt-2 text-gray-500">
                          <Calendar className="w-4 h-4 mr-2 stroke-2" />
                          {new Date(booking.date).toLocaleDateString('en-US', {weekday: 'short', month: 'short', day: 'numeric'})}
                        </div>
                        <div className="flex items-center mt-1 text-gray-500">
                          <Clock className="w-4 h-4 mr-2 stroke-2" />
                          {booking.timeSlot}
                        </div>
                      </div>
                      <span className="bg-red-100 text-red-600 text-sm px-3 py-1 rounded-full font-medium border border-red-200">
                        <X className="w-3 h-3 inline-block mr-1 stroke-2" />
                        Cancelled
                      </span>
                    </div>
                    
                    <div className="border-t border-gray-100 pt-4 mt-4 space-y-2">
                      <div className="flex items-center">
                        <span className="text-gray-400 w-20">Name:</span> 
                        <span className="font-medium text-gray-600">{booking.name}</span>
                      </div>
                      <div className="flex items-center">
                        <span className="text-gray-400 w-20">Phone:</span> 
                        <span className="font-medium text-gray-600">{booking.phoneNumber}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        <div className="text-center mt-12">
          <Link to="/" className="inline-flex items-center text-blue-600 hover:text-blue-700 transition-colors font-medium">
            <ChevronLeft className="w-5 h-5 mr-2" />
            Back to Homepage
          </Link>
        </div>
      </div>
    </div>
  );
};

export default MyAppointments;