import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const ViewOneHome = () => {
  const [apartment, setApartment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeImage, setActiveImage] = useState(0);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [selectedDay, setSelectedDay] = useState(15); // Default to first day (15)
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        console.log('Fetching apartment with ID:', id);

        // Make API call to fetch apartments
        const response = await axios.get('http://localhost:8001/api/apartments');
        console.log('API response:', response.data);

        if (!response.data || !response.data.data || !Array.isArray(response.data.data)) {
          throw new Error('Unexpected API response format');
        }

        const apartmentsArray = response.data.data;
        console.log('Apartments array:', apartmentsArray);

        // Find the apartment with the matching ID or use the first one if no ID
        let apartmentData;
        if (id) {
          apartmentData = apartmentsArray.find((apt) => apt._id === id);
          if (!apartmentData) {
            throw new Error(`Apartment with ID ${id} not found`);
          }
        } else if (apartmentsArray.length > 0) {
          apartmentData = apartmentsArray[0]; // Use the first apartment if no ID specified
        } else {
          throw new Error('No apartments found');
        }

        console.log('Selected apartment data:', apartmentData);
        setApartment(apartmentData);
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

  const handleBack = () => {
    navigate('/apartments');
  };

  const handleBookAppointment = async () => {
    if (selectedDay && selectedSlot) {
      try {
        // For debugging
        console.log('Sending booking request with:', {
          apartmentId: apartment._id,
          date: `2025-03-${selectedDay}`,
          timeSlot: selectedSlot,
          userId: localStorage.getItem('userId') || '65f1dba5f3289c6b25f89bc2' // Replace with a valid ObjectId
        });
        
        // Making the POST request to create a booking
        const response = await axios.post('http://localhost:8001/api/booking', {
          apartmentId: apartment._id,
          date: `2025-03-${selectedDay}`,
          timeSlot: selectedSlot,
          userId: localStorage.getItem('userId') || '65f1dba5f3289c6b25f89bc2' // Replace with a valid ObjectId
        });
  
        console.log('Booking response:', response.data);
        alert('Booking confirmed!');
      } catch (err) {
        console.error('Booking failed:', err);
        // More detailed error message
        if (err.response && err.response.data) {
          alert(`Failed to book appointment: ${err.response.data.message}`);
        } else {
          alert('Failed to book appointment');
        }
      }
    } else {
      alert('Please select both a day and time slot');
    }
  };

  // Show loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Show error state
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

  // Show message if no apartment data
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

  // Days for the booking calendar
  const days = [
    { day: "SAT", date: 15 }, 
    { day: "SUN", date: 16 }, 
    { day: "MON", date: 17 }, 
    { day: "TUE", date: 18 }, 
    { day: "WED", date: 19 }, 
    { day: "THU", date: 20 }, 
    { day: "FRI", date: 21 }
  ];

  // Time slots
  const timeSlots = ["15:00", "15:30", "16:00", "16:30", "17:00", "17:30", "18:00", "18:30", "19:00", "19:30", "20:00"];

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="max-w-6xl mx-auto p-4">
        {/* Title */}
        <h1 className="text-3xl mt-40 font-bold mb-6 text-white">{apartment.title}</h1>

        {/* Image Gallery */}
        <div className="mb-8">
          {/* Main Image */}
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