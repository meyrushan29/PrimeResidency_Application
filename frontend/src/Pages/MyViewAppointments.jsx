import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const MyViewAppointments = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingBooking, setEditingBooking] = useState(null);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTimeSlot, setSelectedTimeSlot] = useState('');

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

  useEffect(() => {
    // Fetch available slots when editing a booking and date changes
    const fetchAvailableSlots = async () => {
      if (!editingBooking || !selectedDate) return;

      try {
        const response = await axios.get(`http://localhost:8001/api/available-slots`, {
          params: {
            apartmentId: editingBooking.apartmentId._id,
            date: selectedDate
          }
        });
        
        // Include the current time slot of the booking being edited
        const currentBookingTimeSlot = editingBooking.timeSlot;
        const allAvailableSlots = response.data.availableSlots;
        
        if (!allAvailableSlots.includes(currentBookingTimeSlot)) {
          allAvailableSlots.push(currentBookingTimeSlot);
          allAvailableSlots.sort();
        }
        
        setAvailableSlots(allAvailableSlots);
      } catch (err) {
        console.error('Error fetching available slots:', err);
        toast.error('Failed to fetch available time slots');
      }
    };

    fetchAvailableSlots();
  }, [editingBooking, selectedDate]);

  const handleCancelBooking = async (bookingId) => {
    try {
      await axios.put(`http://localhost:8001/api/cancel-booking/${bookingId}`);
      
      // Remove the cancelled booking from the list
      setBookings(bookings.map(booking => 
        booking._id === bookingId 
          ? {...booking, status: 'cancelled'} 
          : booking
      ));
      
      toast.success('Booking cancelled successfully');
    } catch (err) {
      console.error('Error cancelling booking:', err);
      toast.error('Failed to cancel booking');
    }
  };

  const handleEditClick = (booking) => {
    setEditingBooking(booking);
    
    // Fix date formatting to avoid timezone issues
    const bookingDate = new Date(booking.date);
    const year = bookingDate.getFullYear();
    const month = String(bookingDate.getMonth() + 1).padStart(2, '0'); // +1 because months are 0-indexed
    const day = String(bookingDate.getDate()).padStart(2, '0');
    
    setSelectedDate(`${year}-${month}-${day}`);
    setSelectedTimeSlot(booking.timeSlot);
  };

  const handleSaveEdit = async () => {
    if (!editingBooking || !selectedDate || !selectedTimeSlot) {
      toast.error('Please select both date and time slot');
      return;
    }

    try {
      const response = await axios.put(`http://localhost:8001/api/update-booking/${editingBooking._id}`, {
        date: selectedDate,
        timeSlot: selectedTimeSlot
      });

      // Use the returned booking data from the API response
      const updatedBooking = response.data.booking;
      
      // Update the bookings list with the edited booking
      setBookings(bookings.map(booking => 
        booking._id === editingBooking._id 
          ? {
              ...booking,
              date: updatedBooking.date,
              timeSlot: selectedTimeSlot
            } 
          : booking
      ));

      setEditingBooking(null);
      setSelectedDate('');
      setSelectedTimeSlot('');
      toast.success('Appointment updated successfully');
    } catch (err) {
      console.error('Error updating booking:', err);
      toast.error(err.response?.data?.message || 'Failed to update appointment');
    }
  };

  const handleCancelEdit = () => {
    setEditingBooking(null);
    setSelectedDate('');
    setSelectedTimeSlot('');
    setAvailableSlots([]);
  };

  // Helper function to format dates consistently
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
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
      
      {/* Edit Booking Modal */}
      {editingBooking && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">Edit Appointment</h2>
            <p className="mb-4">
              <span className="font-semibold">Apartment:</span> {editingBooking.apartmentId.title}
            </p>
            
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Date</label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full bg-gray-700 text-white p-2 rounded"
                min={new Date().toISOString().split('T')[0]}
              />
            </div>
            
            <div className="mb-6">
              <label className="block text-sm font-medium mb-1">Time Slot</label>
              <select
                value={selectedTimeSlot}
                onChange={(e) => setSelectedTimeSlot(e.target.value)}
                className="w-full bg-gray-700 text-white p-2 rounded"
                disabled={!selectedDate || availableSlots.length === 0}
              >
                <option value="">Select a time slot</option>
                {availableSlots.map((slot) => (
                  <option key={slot} value={slot}>
                    {slot}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="flex justify-end space-x-3">
              <button
                onClick={handleCancelEdit}
                className="bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveEdit}
                className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded"
                disabled={!selectedDate || !selectedTimeSlot}
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

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
                  Date: {formatDate(booking.date)}
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
                <div className="flex space-x-3">
                  <button 
                    onClick={() => handleEditClick(booking)}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-full transition-colors"
                  >
                    Edit
                  </button>
                  <button 
                    onClick={() => handleCancelBooking(booking._id)}
                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-full transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyViewAppointments;