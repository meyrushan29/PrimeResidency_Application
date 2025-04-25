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
        return 'bg-yellow-100 text-yellow-800';
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Filter bookings based on status
  const filteredBookings = filter === 'all' 
    ? bookings 
    : bookings.filter(booking => booking.status === filter);

  // Loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 p-6">
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4 rounded">
          <p className="font-bold">Error</p>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">All Bookings</h1>
          
          {/* Filter controls */}
          <div className="flex items-center space-x-4">
            <span className="text-gray-700">Filter by status:</span>
            <select 
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Bookings</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        {/* Bookings count */}
        <div className="mb-6">
          <p className="text-gray-600">
            Showing {filteredBookings.length} bookings
            {filter !== 'all' && ` with status: ${filter}`}
          </p>
        </div>
        
        {/* Bookings table */}
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Apartment
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer Details
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date & Time
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredBookings.length > 0 ? (
                  filteredBookings.map((booking) => (
                    <tr key={booking._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {booking.apartmentId?.title || 'N/A'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{booking.name}</div>
                        <div className="text-sm text-gray-500">{booking.phoneNumber}</div>
                        <div className="text-xs text-gray-500">{booking.userId?.email || 'No email'}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{formatDate(booking.date)}</div>
                        <div className="text-sm text-gray-500">{booking.timeSlot}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span 
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(booking.status)}`}
                        >
                          {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        {booking.status === 'pending' && (
                          <div className="flex space-x-2">
                            <button 
                              className="text-green-600 hover:text-green-900 mr-2"
                              onClick={() => handleConfirmBooking(booking._id)}
                            >
                              Confirm
                            </button>
                            <button 
                              className="text-red-600 hover:text-red-900"
                              onClick={() => handleCancelBooking(booking._id)}
                            >
                              Decline
                            </button>
                          </div>
                        )}
                        
                        {booking.status === 'confirmed' && (
                          <button 
                            className="text-red-600 hover:text-red-900"
                            onClick={() => handleCancelBooking(booking._id)}
                          >
                            Cancel
                          </button>
                        )}
                        
                        {booking.status === 'cancelled' && (
                          <span className="text-gray-500">No actions available</span>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="px-6 py-4 text-center text-sm text-gray-500">
                      No bookings found with the selected filter.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
        
        {/* Legend */}
        <div className="mt-6 bg-white p-4 rounded-lg shadow-sm">
          <h3 className="text-lg font-medium text-gray-700 mb-2">Status Guide</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center">
              <span className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></span>
              <span className="text-sm text-gray-600">Pending: Awaiting admin approval</span>
            </div>
            <div className="flex items-center">
              <span className="w-3 h-3 rounded-full bg-green-500 mr-2"></span>
              <span className="text-sm text-gray-600">Confirmed: Booking approved</span>
            </div>
            <div className="flex items-center">
              <span className="w-3 h-3 rounded-full bg-red-500 mr-2"></span>
              <span className="text-sm text-gray-600">Cancelled: Booking cancelled</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllBookings;