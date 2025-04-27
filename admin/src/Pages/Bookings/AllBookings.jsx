import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const AllBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all'); // 'all', 'pending', 'confirmed', 'cancelled'

  useEffect(() => {
    const fetchAllBookings = async () => {
      try {
        setLoading(true);
        // Make API request to get all bookings
        const response = await axios.get('http://localhost:8001/api/admin/bookings');
        
        if (response.data && response.data.bookings) {
          setBookings(response.data.bookings);
        } else {
          throw new Error('Failed to fetch bookings data');
        }
      } catch (err) {
        console.error('Error fetching bookings:', err);
        setError('Failed to load bookings. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchAllBookings();
  }, []);

  // Format date for display
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Handle confirm booking
  const handleConfirmBooking = async (bookingId) => {
    try {
      // Make the API call to confirm the booking
      const response = await axios.put(`http://localhost:8001/api/admin/bookings/confirm/${bookingId}`);
      
      if (response.data && response.data.booking) {
        // Update local state to reflect the change with the returned booking data
        setBookings(prevBookings => 
          prevBookings.map(booking => 
            booking._id === bookingId ? {...booking, status: 'confirmed'} : booking
          )
        );
        
        toast.success('Booking confirmed successfully');
      } else {
        throw new Error('Failed to confirm booking');
      }
    } catch (err) {
      console.error('Error confirming booking:', err);
      toast.error(err.response?.data?.message || 'Failed to confirm booking');
    }
  };

  // Handle cancel booking
  const handleCancelBooking = async (bookingId) => {
    if (window.confirm('Are you sure you want to cancel this booking?')) {
      try {
        const response = await axios.put(`http://localhost:8001/api/admin/bookings/${bookingId}/cancel`);
        
        if (response.data && response.data.booking) {
          // Update local state to reflect the change with the returned booking data
          setBookings(prevBookings => 
            prevBookings.map(booking => 
              booking._id === bookingId ? {...booking, status: 'cancelled'} : booking
            )
          );
          
          toast.success('Booking cancelled successfully');
        } else {
          throw new Error('Failed to cancel booking');
        }
      } catch (err) {
        console.error('Error cancelling booking:', err);
        toast.error(err.response?.data?.message || 'Failed to cancel booking');
      }
    }
  };

  // Get status badge styles based on status
  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-amber-100 text-amber-800 border border-amber-200';
      case 'confirmed':
        return 'bg-emerald-100 text-emerald-800 border border-emerald-200';
      case 'cancelled':
        return 'bg-rose-100 text-rose-800 border border-rose-200';
      default:
        return 'bg-gray-100 text-gray-800 border border-gray-200';
    }
  };

  // Filter bookings based on status
  const filteredBookings = filter === 'all' 
    ? bookings 
    : bookings.filter(booking => booking.status === filter);

  // Loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600"></div>
          <p className="mt-4 text-gray-600 font-medium">Loading bookings...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="bg-red-50 border-l-4 border-red-500 p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-8 w-8 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-red-800">Error Loading Bookings</h3>
                <p className="mt-1 text-red-700">{error}</p>
                <button 
                  onClick={() => window.location.reload()}
                  className="mt-3 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  Try Again
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white shadow-sm rounded-xl p-6 mb-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Bookings Management</h1>
              <p className="mt-1 text-gray-500">
                Showing {filteredBookings.length} bookings
                {filter !== 'all' && ` with status: ${filter}`}
              </p>
            </div>
            
            {/* Filter controls */}
            <div className="flex items-center space-x-2 w-full md:w-auto">
              <span className="text-gray-700 whitespace-nowrap">Filter by:</span>
              <select 
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 text-gray-700 flex-grow md:flex-grow-0"
              >
                <option value="all">All Bookings</option>
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>
        </div>
        
        {/* Status cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white p-4 rounded-xl shadow-sm border-l-4 border-amber-400 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Pending</p>
              <p className="text-2xl font-bold text-gray-800">
                {bookings.filter(b => b.status === 'pending').length}
              </p>
            </div>
            <div className="bg-amber-100 p-3 rounded-lg">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-xl shadow-sm border-l-4 border-emerald-400 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Confirmed</p>
              <p className="text-2xl font-bold text-gray-800">
                {bookings.filter(b => b.status === 'confirmed').length}
              </p>
            </div>
            <div className="bg-emerald-100 p-3 rounded-lg">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-xl shadow-sm border-l-4 border-rose-400 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Cancelled</p>
              <p className="text-2xl font-bold text-gray-800">
                {bookings.filter(b => b.status === 'cancelled').length}
              </p>
            </div>
            <div className="bg-rose-100 p-3 rounded-lg">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-rose-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
          </div>
        </div>
        
        {/* Bookings table */}
        <div className="bg-white shadow-md rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Apartment
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Customer Details
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Date & Time
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredBookings.length > 0 ? (
                  filteredBookings.map((booking) => (
                    <tr key={booking._id} className="hover:bg-gray-50 transition-colors duration-150">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {booking.apartmentId?.title || 'N/A'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-start">
                          <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-700 font-medium mr-3">
                            {booking.name ? booking.name.charAt(0).toUpperCase() : '?'}
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-900">{booking.name}</div>
                            <div className="text-sm text-gray-500">{booking.phoneNumber}</div>
                            
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{formatDate(booking.date)}</div>
                        <div className="text-sm text-gray-500">{booking.timeSlot}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span 
                          className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(booking.status)}`}
                        >
                          {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        {booking.status === 'pending' && (
                          <div className="flex space-x-2">
                            <button 
                              className="px-3 py-1 bg-emerald-50 text-emerald-700 rounded-md hover:bg-emerald-100 transition-colors duration-150 flex items-center"
                              onClick={() => handleConfirmBooking(booking._id)}
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                              Confirm
                            </button>
                            <button 
                              className="px-3 py-1 bg-rose-50 text-rose-700 rounded-md hover:bg-rose-100 transition-colors duration-150 flex items-center"
                              onClick={() => handleCancelBooking(booking._id)}
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                              Decline
                            </button>
                          </div>
                        )}
                        
                        {booking.status === 'confirmed' && (
                          <button 
                            className="px-3 py-1 bg-rose-50 text-rose-700 rounded-md hover:bg-rose-100 transition-colors duration-150 flex items-center"
                            onClick={() => handleCancelBooking(booking._id)}
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                            Cancel
                          </button>
                        )}
                        
                        {booking.status === 'cancelled' && (
                          <span className="text-gray-400 italic text-xs">No actions available</span>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="px-6 py-8 text-center">
                      <div className="flex flex-col items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                        </svg>
                        <p className="text-gray-500 font-medium">No bookings found with the selected filter</p>
                        {filter !== 'all' && (
                          <button 
                            onClick={() => setFilter('all')} 
                            className="mt-2 text-blue-600 hover:text-blue-800 text-sm font-medium"
                          >
                            Show all bookings
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
        
        {/* Legend */}
        <div className="mt-6 bg-white p-6 rounded-xl shadow-sm">
          <h3 className="text-lg font-medium text-gray-800 mb-4">Status Guide</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center bg-amber-50 p-3 rounded-lg">
              <span className="w-4 h-4 rounded-full bg-amber-400 mr-3"></span>
              <span className="text-sm text-gray-700">Pending: Awaiting admin approval</span>
            </div>
            <div className="flex items-center bg-emerald-50 p-3 rounded-lg">
              <span className="w-4 h-4 rounded-full bg-emerald-400 mr-3"></span>
              <span className="text-sm text-gray-700">Confirmed: Booking approved</span>
            </div>
            <div className="flex items-center bg-rose-50 p-3 rounded-lg">
              <span className="w-4 h-4 rounded-full bg-rose-400 mr-3"></span>
              <span className="text-sm text-gray-700">Cancelled: Booking cancelled</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllBookings;