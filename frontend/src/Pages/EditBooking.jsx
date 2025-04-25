import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

// Configure axios with the base URL - add this line
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8001'; // Adjust port if needed

const EditBooking = () => {
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState('');
  const [selectedDay, setSelectedDay] = useState('');
  const [availableSlots, setAvailableSlots] = useState([]);
  const [name, setName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const { id: bookingId } = useParams();
  const navigate = useNavigate();

  const generateFutureDays = () => {
    const today = new Date();
    const futureDays = [
      {
        day: today.toLocaleString('en-US', { weekday: 'short' }).toUpperCase(),
        date: today.getDate(),
        month: today.getMonth(),
        year: today.getFullYear(),
        fullDate: today.toISOString().split('T')[0],
        isToday: true
      }
    ];
    
    for (let i = 1; i <= 6; i++) {
      const futureDate = new Date(today);
      futureDate.setDate(today.getDate() + i);
      futureDays.push({
        day: futureDate.toLocaleString('en-US', { weekday: 'short' }).toUpperCase(),
        date: futureDate.getDate(),
        month: futureDate.getMonth(),
        year: futureDate.getFullYear(),
        fullDate: futureDate.toISOString().split('T')[0],
        isToday: false
      });
    }
    return futureDays;
  };

  const days = generateFutureDays();

  const timeSlots = [
    "15:00", "15:30", "16:00", "16:30", "17:00", 
    "17:30", "18:00", "18:30", "19:00", "19:30", "20:00"
  ];

  // Function to fetch booking data
  const fetchBookingData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log(`Fetching booking with ID: ${bookingId}`);
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_BASE_URL}/api/booking/${bookingId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      console.log('Booking API response:', response.data);
      
      if (!response.data || !response.data.booking) {
        throw new Error('No booking data received from server');
      }

      const bookingData = response.data.booking;
      setBooking(bookingData);
      
      // Format the date from the booking data
      const bookingDate = new Date(bookingData.date);
      const formattedDate = bookingDate.toISOString().split('T')[0];
      
      console.log('Booking date:', formattedDate);
      
      setSelectedDay(formattedDate);
      setSelectedSlot(bookingData.timeSlot);
      setName(bookingData.name);
      setPhoneNumber(bookingData.phoneNumber);
      
      // Fetch available slots once we have the booking data
      if (bookingData.apartmentId) {
        // Make sure we have the apartment ID (it might be an object if populated)
        const apartmentId = typeof bookingData.apartmentId === 'object' 
          ? bookingData.apartmentId._id 
          : bookingData.apartmentId;
          
        if (apartmentId && formattedDate) {
          await fetchAvailableSlots(apartmentId, formattedDate, bookingData.timeSlot);
        }
      }
    } catch (err) {
      console.error('Error fetching booking data:', err);
      setError(err.response?.data?.message || 'Failed to load booking');
    } finally {
      setLoading(false);
    }
  };
  
  // Function to fetch available slots
  const fetchAvailableSlots = async (apartmentId, date, currentTimeSlot) => {
    try {
      console.log(`Fetching available slots for apartment ${apartmentId} on ${date}`);
      
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_BASE_URL}/api/available-slots`, {
        params: { apartmentId, date },
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      console.log('Available slots response:', response.data);
      
      if (response.data && response.data.availableSlots) {
        let slots = [...response.data.availableSlots];
        
        // Include the current booking's time slot in available slots if it exists
        if (currentTimeSlot && !slots.includes(currentTimeSlot)) {
          slots.push(currentTimeSlot);
          // Sort the slots in chronological order
          slots.sort();
        }
        
        setAvailableSlots(slots);
      } else {
        setAvailableSlots([]);
      }
    } catch (err) {
      console.error('Error fetching available slots:', err);
      toast.error('Failed to load available time slots');
      setAvailableSlots([]);
    }
  };

  useEffect(() => {
    if (bookingId) {
      fetchBookingData();
    } else {
      setError('No booking ID provided');
      setLoading(false);
    }
  }, [bookingId]);

  const handleDayClick = (dayData) => {
    console.log('Selected day:', dayData.fullDate);
    setSelectedDay(dayData.fullDate);
    
    if (booking && booking.apartmentId) {
      // Determine apartment ID based on how it's stored
      const apartmentId = typeof booking.apartmentId === 'object' 
        ? booking.apartmentId._id 
        : booking.apartmentId;
        
      fetchAvailableSlots(apartmentId, dayData.fullDate, booking.timeSlot);
    }
  };

  const handleSlotClick = (slot) => {
    console.log('Selected time slot:', slot);
    setSelectedSlot(slot);
  };

  const handleUpdateBooking = async () => {
    if (!selectedDay || !selectedSlot) {
      toast.error('Please select both a day and time slot');
      return;
    }

    if (!name.trim()) {
      toast.error('Please enter your name');
      return;
    }

    if (!phoneNumber.trim()) {
      toast.error('Please enter your phone number');
      return;
    }

    try {
      console.log('Updating booking with data:', {
        date: selectedDay,
        timeSlot: selectedSlot,
        name,
        phoneNumber
      });
      
      const token = localStorage.getItem('token');
      const response = await axios.put(`${API_BASE_URL}/api/update-booking/${bookingId}`, {
        date: selectedDay,
        timeSlot: selectedSlot,
        name,
        phoneNumber
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      console.log('Update response:', response.data);

      toast.success('Booking updated successfully!');
      navigate('/my-appointments');
    } catch (err) {
      console.error('Update failed:', err);
      toast.error(err.response?.data?.message || 'Failed to update booking');
    }
  };

  const handleCancel = () => {
    navigate('/my-appointments');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-xl">Loading booking data...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-xl text-red-400">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="max-w-6xl mx-auto p-4">
        <h1 className="text-3xl font-bold mb-6 text-white mt-32">Edit Booking</h1>

        <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold text-white mb-6">Update Your Booking</h2>
          
          {/* Personal Information */}
          <div className="mb-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="name" className="block text-gray-300 mb-2">Full Name</label>
              <input 
                type="text" 
                id="name" 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your full name"
              />
            </div>
            <div>
              <label htmlFor="phone" className="block text-gray-300 mb-2">Phone Number</label>
              <input 
                type="tel" 
                id="phone" 
                value={phoneNumber} 
                onChange={(e) => setPhoneNumber(e.target.value)} 
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your phone number"
              />
            </div>
          </div>
          
          {/* Day Selection */}
          <div className="mb-4">
            <h3 className="text-lg font-medium text-gray-300 mb-3">Select Day</h3>
            <div className="flex space-x-4 overflow-x-auto pb-4">
              {days.map((day) => (
                <div 
                  key={day.fullDate}
                  onClick={() => handleDayClick(day)}
                  className={`flex flex-col items-center justify-center ${
                    selectedDay === day.fullDate ? 'bg-blue-500' : 'bg-white bg-opacity-10 hover:bg-opacity-20'
                  } cursor-pointer rounded-full transition-all duration-200 min-w-24 h-24 p-4`}
                >
                  <span className={`font-semibold ${selectedDay === day.fullDate ? 'text-white' : 'text-gray-200'}`}>
                    {day.day}
                  </span>
                  <span className={`text-xl font-bold ${selectedDay === day.fullDate ? 'text-white' : 'text-gray-200'}`}>
                    {day.date}
                  </span>
                  {day.isToday && <span className="text-xs text-green-400 mt-1">Today</span>}
                </div>
              ))}
            </div>
          </div>

          {/* Time Slots */}
          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-300 mb-3">Select Time</h3>
            <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-7 gap-4">
              {timeSlots.map((slot) => {
                const isAvailable = availableSlots.includes(slot);
                return (
                  <button
                    key={slot}
                    onClick={() => isAvailable && handleSlotClick(slot)}
                    disabled={!isAvailable}
                    className={`py-3 px-4 rounded-full transition-all duration-200 ${
                      selectedSlot === slot 
                        ? 'bg-blue-500 text-white' 
                        : isAvailable 
                          ? 'bg-white bg-opacity-10 text-gray-300 hover:bg-opacity-20' 
                          : 'bg-gray-700 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    {slot}
                  </button>
                );
              })}
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="mt-8 flex space-x-4">
            <button 
              onClick={handleUpdateBooking}
              className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-8 rounded-full transition-all duration-200"
            >
              Update Booking
            </button>
            <button 
              onClick={handleCancel}
              className="bg-gray-600 hover:bg-gray-700 text-white font-semibold py-3 px-8 rounded-full transition-all duration-200"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditBooking;