import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const ViewOneHome = () => {
  const [apartment, setApartment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeImage, setActiveImage] = useState(0);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [selectedDay, setSelectedDay] = useState(null);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [name, setName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const { id } = useParams();
  const navigate = useNavigate();

  const generateFutureDays = () => {
    const today = new Date();
    const futureDays = [
      {
        day: today.toLocaleString('en-US', { weekday: 'short' }).toUpperCase(),
        date: today.getDate(),
        isToday: true
      }
    ];
    
    for (let i = 1; i <= 6; i++) {
      const futureDate = new Date(today);
      futureDate.setDate(today.getDate() + i);
      futureDays.push({
        day: futureDate.toLocaleString('en-US', { weekday: 'short' }).toUpperCase(),
        date: futureDate.getDate(),
        isToday: false
      });
    }
    return futureDays;
  };

  const generateFutureTimeSlots = () => {
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();

    return [
      "15:00", "15:30", "16:00", "16:30", "17:00", 
      "17:30", "18:00", "18:30", "19:00", "19:30", "20:00"
    ].filter(slot => {
      const [hours, minutes] = slot.split(':').map(Number);
      
      // If selected day is today, filter out past time slots
      if (selectedDay === now.getDate()) {
        return hours > currentHour || (hours === currentHour && minutes > currentMinute);
      }
      
      // For future days, all time slots are available
      return true;
    });
  };

  const days = generateFutureDays();
  const timeSlots = generateFutureTimeSlots();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axios.get('http://localhost:8001/api/apartments');
        
        if (!response.data || !response.data.data || !Array.isArray(response.data.data)) {
          throw new Error('Unexpected API response format');
        }

        const apartmentsArray = response.data.data;
        
        let apartmentData;
        if (id) {
          apartmentData = apartmentsArray.find((apt) => apt._id === id);
          if (!apartmentData) {
            throw new Error(`Apartment with ID ${id} not found`);
          }
        } else if (apartmentsArray.length > 0) {
          apartmentData = apartmentsArray[0];
        } else {
          throw new Error('No apartments found');
        }

        setApartment(apartmentData);
        // Set the first available day (today) as the default selected day
        setSelectedDay(days[0].date);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError(`Failed to load apartment data: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleImageClick = (index) => {
    setActiveImage(index);
  };

  const handleSlotClick = (slot) => {
    setSelectedSlot(slot);
  };

  const handleDayClick = (day) => {
    setSelectedDay(day);
  };

  const handleBookAppointment = async () => {
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

    const selectedDate = new Date();
    selectedDate.setDate(selectedDay);

    const userId = localStorage.getItem('userId') || '65f1dba5f3289c6b25f89bc2';

    try {
      const response = await axios.post('http://localhost:8001/api/booking', {
        apartmentId: apartment._id,
        date: selectedDate.toISOString().split('T')[0],
        timeSlot: selectedSlot,
        userId: userId,
        name: name,
        phoneNumber: phoneNumber
      });

      toast.success('Booking confirmed!');
      navigate('/my-appointments');
    } catch (err) {
      console.error('Booking failed:', err);
      if (err.response && err.response.data) {
        toast.error(`Failed to book appointment: ${err.response.data.message}`);
      } else {
        toast.error('Failed to book appointment');
      }
    }
  };

  const handleBack = () => {
    navigate('/apartments');
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
          <button onClick={handleBack} className="mt-2 text-blue-300 hover:text-blue-100">
            Go back to all apartments
          </button>
        </div>
      </div>
    );
  }

  // No apartment data
  if (!apartment) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-8">
        <p className="text-lg text-gray-300">No apartment data available</p>
        <button onClick={handleBack} className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition">
          Go back to all apartments
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="max-w-6xl mx-auto p-4">
        <h1 className="text-3xl mt-40 font-bold mb-6 text-white">{apartment.title}</h1>

        {/* Image Gallery */}
        <div className="mb-8">
          {apartment.images && apartment.images.length > 0 ? (
            <div className="h-96 bg-gray-800 mb-2 overflow-hidden rounded-lg shadow-lg">
              <img
                src={`http://localhost:8001${apartment.images[activeImage]}`}
                alt={apartment.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  console.log('Image failed to load:', e.target.src);
                  e.target.src = 'https://via.placeholder.com/800x600?text=No+Image';
                }}
              />
            </div>
          ) : (
            <div className="h-96 bg-gray-800 flex items-center justify-center rounded-lg shadow-lg">
              <p className="text-gray-400">No images available</p>
            </div>
          )}

          {/* Image Thumbnails */}
          {apartment.images && apartment.images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto py-2">
              {apartment.images.map((img, index) => (
                <div
                  key={index}
                  onClick={() => handleImageClick(index)}
                  className={`w-24 h-24 flex-shrink-0 cursor-pointer transition-all duration-200 ${
                    activeImage === index ? 'ring-2 ring-blue-500 scale-105' : 'opacity-80 hover:opacity-100'
                  }`}
                >
                  <img
                    src={`http://localhost:8001${img}`}
                    alt={`Thumbnail ${index + 1}`}
                    className="w-full h-full object-cover rounded"
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/100?text=Thumb';
                    }}
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Property Details */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div className="md:col-span-2">
            <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
              <div className="flex justify-between items-center mb-6 border-b border-gray-700 pb-4">
                <h2 className="text-2xl font-semibold text-white">Property Details</h2>
                <span className="text-2xl font-bold text-green-400">
                  ${apartment.price?.toLocaleString() || 'N/A'}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-6 mb-8">
                <div>
                  <p className="text-gray-400 text-sm">Area</p>
                  <p className="font-semibold text-lg">{apartment.area} sq ft</p>
                </div>

                <div>
                  <p className="text-gray-400 text-sm">Bedrooms</p>
                  <p className="font-semibold text-lg">{apartment.bedrooms}</p>
                </div>

                <div>
                  <p className="text-gray-400 text-sm">Bathrooms</p>
                  <p className="font-semibold text-lg">{apartment.bathrooms}</p>
                </div>

                <div>
                  <p className="text-gray-400 text-sm">Furnished</p>
                  <p className="font-semibold text-lg">
                    {apartment.furnished ? <span className="text-green-400">Yes</span> : <span className="text-red-400">No</span>}
                  </p>
                </div>

                <div>
                  <p className="text-gray-400 text-sm">View</p>
                  <p className="font-semibold text-lg">{apartment.view || 'N/A'}</p>
                </div>

                {apartment.createdAt && (
                  <div>
                    <p className="text-gray-400 text-sm">Listed on</p>
                    <p className="font-semibold text-lg">
                      {new Date(apartment.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                )}
              </div>

              <div className="border-t border-gray-700 pt-6">
                <h3 className="text-xl font-semibold mb-3 text-blue-300">Description</h3>
                <p className="text-gray-300 leading-relaxed">{apartment.description}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Booking Section */}
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg mt-8">
          <h2 className="text-2xl font-semibold text-white mb-6">Booking Slots</h2>
          
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
          <div className="flex space-x-4 overflow-x-auto pb-4">
            {days.map((day) => (
              <div 
                key={day.date}
                onClick={() => handleDayClick(day.date)}
                className={`flex flex-col items-center justify-center ${
                  selectedDay === day.date ? 'bg-blue-500' : 'bg-white bg-opacity-10 hover:bg-opacity-20'
                } cursor-pointer rounded-full transition-all duration-200 min-w-24 h-24 p-4`}
              >
                <span className={`font-semibold ${selectedDay === day.date ? 'text-white' : 'text-gray-200'}`}>
                  {day.day}
                </span>
                <span className={`text-xl font-bold ${selectedDay === day.date ? 'text-white' : 'text-gray-200'}`}>
                  {day.date}
                </span>
                {day.isToday && <span className="text-xs text-green-400 mt-1">Today</span>}
              </div>
            ))}
          </div>

          {/* Time Slots */}
          <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-11 gap-4 mt-6">
            {timeSlots.map((slot) => (
              <button
                key={slot}
                onClick={() => handleSlotClick(slot)}
                className={`py-3 px-4 rounded-full transition-all duration-200 ${
                  selectedSlot === slot ? 'bg-blue-500 text-white' : 'bg-white bg-opacity-10 text-gray-300 hover:bg-opacity-20'
                }`}
              >
                {slot}
              </button>
            ))}
          </div>
          
          {/* Book Appointment Button */}
          <div className="mt-8">
            <button 
              onClick={handleBookAppointment}
              className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-8 rounded-full transition-all duration-200"
            >
              Book an appointment
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewOneHome;