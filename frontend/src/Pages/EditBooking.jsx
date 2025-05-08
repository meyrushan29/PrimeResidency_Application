import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { 
  Calendar, 
  Clock, 
  User, 
  Phone, 
  CheckCircle, 
  XCircle, 
  ArrowLeft, 
  Save, 
  CalendarClock,
  CalendarDays,
  AlertCircle,
  Info,
  Check
} from 'lucide-react';

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
  
  // Validation states
  const [nameError, setNameError] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [dayError, setDayError] = useState('');
  const [timeError, setTimeError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  // Validation functions
  const validateName = (value) => {
    if (!value.trim()) {
      setNameError('Name is required');
      return false;
    } else if (value.trim().length < 3) {
      setNameError('Name must be at least 3 characters');
      return false;
    } else if (!/^[a-zA-Z\s.'-]+$/.test(value)) {
      setNameError('Name contains invalid characters');
      return false;
    }
    setNameError('');
    return true;
  };

  const validatePhone = (value) => {
    if (!value.trim()) {
      setPhoneError('Phone number is required');
      return false;
    } else if (!/^(?:\+94|0)?[0-9]{9,10}$/.test(value.replace(/\s/g, ''))) {
      setPhoneError('Please enter a valid Sri Lankan phone number');
      return false;
    }
    setPhoneError('');
    return true;
  };

  const validateDay = () => {
    if (!selectedDay) {
      setDayError('Please select a day for your appointment');
      return false;
    }
    setDayError('');
    return true;
  };

  const validateTimeSlot = () => {
    if (!selectedSlot) {
      setTimeError('Please select a time slot for your appointment');
      return false;
    }
    setTimeError('');
    return true;
  };

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
    setDayError(''); // Clear day error when a day is selected
    
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
    setTimeError(''); // Clear time error when a slot is selected
  };

  const handleUpdateBooking = async () => {
    // Validate all fields
    const isNameValid = validateName(name);
    const isPhoneValid = validatePhone(phoneNumber);
    const isDayValid = validateDay();
    const isTimeValid = validateTimeSlot();
    
    // If any validation fails, return early
    if (!isNameValid || !isPhoneValid || !isDayValid || !isTimeValid) {
      toast.error('Please correct the errors in the form');
      return;
    }

    setIsSubmitting(true);

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
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate('/my-appointments');
  };

  const handleNameChange = (e) => {
    const value = e.target.value;
    setName(value);
    validateName(value);
  };

  const handlePhoneChange = (e) => {
    const value = e.target.value;
    setPhoneNumber(value);
    validatePhone(value);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 border-4 border-t-blue-600 border-b-blue-600 border-l-transparent border-r-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-gray-700 font-medium">Loading booking details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
        <div className="bg-white border-l-4 border-red-500 p-8 rounded-lg shadow-xl max-w-md w-full">
          <h2 className="text-xl font-bold text-red-600 mb-4">Error Loading Booking</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button 
            onClick={() => navigate('/my-appointments')} 
            className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg transition font-medium flex items-center justify-center"
          >
            <ArrowLeft size={18} className="mr-2" />
            Back to My Appointments
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="max-w-4xl mx-auto p-4 pt-32 pb-16">
        {/* Back button */}
        <button 
          onClick={handleCancel}
          className="flex items-center mb-6 text-blue-600 hover:text-blue-800 transition-colors font-medium"
        >
          <ArrowLeft size={18} className="mr-2" />
          Back to My Appointments
        </button>

        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Edit Booking</h1>
          {booking && booking.apartmentId && typeof booking.apartmentId === 'object' && (
            <div className="bg-blue-100 text-blue-700 px-4 py-2 rounded-full font-medium text-sm">
              {booking.apartmentId.title || 'Property'}
            </div>
          )}
        </div>

        <div className="bg-white p-8 rounded-2xl shadow-md border border-gray-200">
          <div className="flex items-center mb-8 pb-4 border-b border-gray-100">
            <CalendarClock size={24} className="text-blue-600 mr-3" />
            <h2 className="text-2xl font-bold text-gray-800">Update Your Appointment</h2>
          </div>
          
          {/* Personal Information */}
          <div className="mb-8 space-y-6">
            <h3 className="text-lg font-bold text-gray-800 flex items-center mb-4">
              <User size={18} className="text-blue-600 mr-2" />
              Personal Information <span className="text-red-500 ml-1">*</span>
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="name" className="block text-gray-700 text-sm font-medium mb-1">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User size={16} className={`${nameError ? 'text-red-400' : 'text-gray-400'}`} />
                  </div>
                  <input 
                    type="text" 
                    id="name" 
                    value={name} 
                    onChange={handleNameChange}
                    className={`w-full bg-gray-50 border ${nameError ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'} rounded-lg pl-10 pr-4 py-2.5 text-gray-700 focus:outline-none focus:ring-2 focus:border-transparent`}
                    placeholder="Enter your full name"
                  />
                </div>
                {nameError && (
                  <p className="mt-1 text-sm text-red-600 flex items-start">
                    <AlertCircle size={14} className="mr-1 mt-0.5 flex-shrink-0" /> 
                    {nameError}
                  </p>
                )}
              </div>
              <div>
                <label htmlFor="phone" className="block text-gray-700 text-sm font-medium mb-1">
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Phone size={16} className={`${phoneError ? 'text-red-400' : 'text-gray-400'}`} />
                  </div>
                  <input 
                    type="tel" 
                    id="phone" 
                    value={phoneNumber} 
                    onChange={handlePhoneChange}
                    className={`w-full bg-gray-50 border ${phoneError ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'} rounded-lg pl-10 pr-4 py-2.5 text-gray-700 focus:outline-none focus:ring-2 focus:border-transparent`}
                    placeholder="Enter your phone number"
                  />
                </div>
                {phoneError ? (
                  <p className="mt-1 text-sm text-red-600 flex items-start">
                    <AlertCircle size={14} className="mr-1 mt-0.5 flex-shrink-0" /> 
                    {phoneError}
                  </p>
                ) : (
                  <p className="mt-1 text-xs text-gray-500">Format: 07XXXXXXXX or +947XXXXXXX</p>
                )}
              </div>
            </div>
          </div>
          
          {/* Date Selection */}
          <div className="mb-8">
            <h3 className="text-lg font-bold text-gray-800 flex items-center mb-4">
              <CalendarDays size={18} className="text-blue-600 mr-2" />
              Select Day <span className="text-red-500 ml-1">*</span>
            </h3>
            
            {dayError && (
              <div className="mb-3 p-2 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm flex items-center">
                <AlertCircle size={16} className="mr-2 flex-shrink-0" />
                {dayError}
              </div>
            )}
            
            <div className={`flex space-x-2 overflow-x-auto pb-4 ${dayError ? 'border border-red-300 rounded-lg p-2 bg-red-50' : ''}`}>
              {days.map((day) => (
                <div 
                  key={day.fullDate}
                  onClick={() => handleDayClick(day)}
                  className={`flex flex-col items-center justify-center cursor-pointer rounded-lg transition-all duration-200 min-w-16 h-20 p-2 ${
                    selectedDay === day.fullDate 
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md' 
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                  }`}
                >
                  <span className="text-xs font-medium">{day.day}</span>
                  <span className="text-lg font-bold">{day.date}</span>
                  {day.isToday && (
                    <span className={`text-xs ${selectedDay === day.fullDate ? 'text-white' : 'text-emerald-600'} mt-1`}>
                      Today
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
          
          {/* Time Slots */}
          <div className="mb-8">
            <h3 className="text-lg font-bold text-gray-800 flex items-center mb-4">
              <Clock size={18} className="text-blue-600 mr-2" />
              Select Time <span className="text-red-500 ml-1">*</span>
            </h3>
            
            {timeError && (
              <div className="mb-3 p-2 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm flex items-center">
                <AlertCircle size={16} className="mr-2 flex-shrink-0" />
                {timeError}
              </div>
            )}
            
            <div className={`grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-7 gap-3 ${timeError ? 'border border-red-300 rounded-lg p-2 bg-red-50' : ''}`}>
              {timeSlots.map((slot) => {
                const isAvailable = availableSlots.includes(slot);
                return (
                  <button
                    key={slot}
                    onClick={() => isAvailable && handleSlotClick(slot)}
                    disabled={!isAvailable}
                    className={`py-2 px-3 rounded-lg transition-all duration-200 flex items-center justify-center text-sm ${
                      selectedSlot === slot 
                        ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md' 
                        : isAvailable 
                          ? 'bg-gray-100 hover:bg-gray-200 text-gray-700' 
                          : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    {isAvailable ? (
                      selectedSlot === slot ? (
                        <CheckCircle size={14} className="mr-1.5" />
                      ) : (
                        <Clock size={14} className="mr-1.5 text-gray-500" />
                      )
                    ) : (
                      <XCircle size={14} className="mr-1.5" />
                    )}
                    {slot}
                  </button>
                );
              })}
            </div>
            <div className="flex items-start mt-3">
              <Info size={14} className="text-blue-500 mt-0.5 mr-1.5 flex-shrink-0" />
              <p className="text-gray-500 text-sm italic">
                Only available time slots are selectable. Your current slot is included even if otherwise booked.
              </p>
            </div>
          </div>
          
          {/* Required fields note */}
          <div className="mb-6 pb-6 border-b border-gray-100">
            <p className="text-sm text-gray-500 flex items-center">
              <span className="text-red-500 mr-1">*</span> Required fields
            </p>
          </div>
          
          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-end mt-8 pt-4">
            <button 
              onClick={handleCancel}
              type="button"
              className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors flex items-center justify-center"
            >
              <XCircle size={18} className="mr-2" />
              Cancel
            </button>
            <button 
              onClick={handleUpdateBooking}
              type="button"
              disabled={isSubmitting || !!nameError || !!phoneError}
              className={`px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-lg font-medium transition-all duration-300 shadow-md hover:shadow-lg flex items-center justify-center ${
                isSubmitting || nameError || phoneError ? 'opacity-70 cursor-not-allowed' : ''
              }`}
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Updating...
                </>
              ) : (
                <>
                  <Save size={18} className="mr-2" />
                  Update Booking
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditBooking;