import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { 
  Calendar, 
  Clock, 
  Home, 
  Square, 
  Bed, 
  Bath, 
  Eye, 
  ArrowLeft, 
  CheckCircle, 
  XCircle,
  MapPin,
  CalendarClock,
  Info
} from 'lucide-react';

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
    navigate('/availablehome');
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 border-4 border-t-blue-600 border-b-blue-600 border-l-transparent border-r-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-gray-700 font-medium">Loading property details...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
        <div className="bg-white border-l-4 border-red-500 p-8 rounded-lg shadow-xl max-w-md w-full">
          <h2 className="text-xl font-bold text-red-600 mb-4">Error Loading Property</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button 
            onClick={handleBack} 
            className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg transition font-medium flex items-center justify-center"
          >
            <ArrowLeft size={18} className="mr-2" />
            Back to All Properties
          </button>
        </div>
      </div>
    );
  }

  // No apartment data
  if (!apartment) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-8">
        <div className="bg-white p-10 rounded-xl shadow-lg text-center max-w-md w-full border border-gray-200">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Home size={28} className="text-gray-400" />
          </div>
          <h1 className="text-2xl font-bold mb-4 text-gray-800">No Property Data</h1>
          <p className="text-gray-600 mb-6">We couldn't find the property you're looking for.</p>
          <button 
            onClick={handleBack} 
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition inline-flex items-center font-medium"
          >
            <ArrowLeft size={18} className="mr-2" />
            Browse Properties
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="max-w-6xl mx-auto p-4 pt-32 pb-16">
        {/* Back Button */}
        <button 
          onClick={handleBack}
          className="flex items-center mb-6 text-blue-600 hover:text-blue-800 transition-colors font-medium"
        >
          <ArrowLeft size={18} className="mr-2" />
          Back to All Properties
        </button>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">{apartment.title}</h1>
          <div className="mt-2 md:mt-0 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-2 rounded-full font-bold shadow-md">
            LKR {apartment.price?.toLocaleString() || 'N/A'}/month
          </div>
        </div>

        {/* Image Gallery */}
        <div className="mb-8">
          {apartment.images && apartment.images.length > 0 ? (
            <div className="h-96 md:h-[500px] bg-white mb-3 overflow-hidden rounded-2xl shadow-md border border-gray-200">
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
            <div className="h-96 md:h-[500px] bg-gray-100 flex items-center justify-center rounded-2xl shadow-md border border-gray-200">
              <Home size={64} className="text-gray-400" />
            </div>
          )}

          {/* Image Thumbnails */}
          {apartment.images && apartment.images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto py-2">
              {apartment.images.map((img, index) => (
                <div
                  key={index}
                  onClick={() => handleImageClick(index)}
                  className={`w-24 h-24 flex-shrink-0 cursor-pointer transition-all duration-200 rounded-lg overflow-hidden ${
                    activeImage === index 
                      ? 'ring-2 ring-blue-600 scale-105 shadow-md' 
                      : 'opacity-80 hover:opacity-100 border border-gray-200'
                  }`}
                >
                  <img
                    src={`http://localhost:8001${img}`}
                    alt={`Thumbnail ${index + 1}`}
                    className="w-full h-full object-cover"
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
            <div className="bg-white p-8 rounded-2xl shadow-md border border-gray-200">
              <div className="flex justify-between items-center mb-8 pb-4 border-b border-gray-100">
                <h2 className="text-2xl font-bold text-gray-800">Property Details</h2>
                <div className="flex items-center text-gray-600">
                  <MapPin size={18} className="mr-2 text-blue-600" />
                  <span>{apartment.location || 'Location unavailable'}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 lg:grid-cols-3 gap-y-8 gap-x-6 mb-8">
                <div className="flex items-start">
                  <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center mr-3 flex-shrink-0">
                    <Square size={18} className="text-blue-600" />
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm">Area</p>
                    <p className="font-semibold text-gray-800">{apartment.area} sq ft</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center mr-3 flex-shrink-0">
                    <Bed size={18} className="text-blue-600" />
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm">Bedrooms</p>
                    <p className="font-semibold text-gray-800">{apartment.bedrooms}</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center mr-3 flex-shrink-0">
                    <Bath size={18} className="text-blue-600" />
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm">Bathrooms</p>
                    <p className="font-semibold text-gray-800">{apartment.bathrooms}</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center mr-3 flex-shrink-0">
                    {apartment.furnished ? (
                      <CheckCircle size={18} className="text-emerald-600" />
                    ) : (
                      <XCircle size={18} className="text-gray-400" />
                    )}
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm">Furnished</p>
                    <p className="font-semibold text-gray-800">
                      {apartment.furnished ? (
                        <span className="text-emerald-600">Yes</span>
                      ) : (
                        <span className="text-gray-500">No</span>
                      )}
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center mr-3 flex-shrink-0">
                    <Eye size={18} className="text-blue-600" />
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm">View</p>
                    <p className="font-semibold text-gray-800">{apartment.view || 'N/A'}</p>
                  </div>
                </div>

                {apartment.createdAt && (
                  <div className="flex items-start">
                    <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center mr-3 flex-shrink-0">
                      <Calendar size={18} className="text-blue-600" />
                    </div>
                    <div>
                      <p className="text-gray-500 text-sm">Listed on</p>
                      <p className="font-semibold text-gray-800">
                        {new Date(apartment.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              <div className="border-t border-gray-100 pt-8">
                <h3 className="text-xl font-bold mb-4 text-gray-800 flex items-center">
                  <Info size={20} className="mr-2 text-blue-600" />
                  Description
                </h3>
                <p className="text-gray-600 leading-relaxed">{apartment.description || 'No description available for this property.'}</p>
              </div>
            </div>
          </div>

          {/* Sidebar/Contact */}
          <div className="md:col-span-1">
            <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-200 sticky top-24">
              <h3 className="text-xl font-bold mb-4 text-gray-800 flex items-center">
                <CalendarClock size={20} className="mr-2 text-blue-600" />
                Schedule a Viewing
              </h3>
              <p className="text-gray-600 mb-6">Fill in your details below to book an appointment to view this property.</p>
              
              {/* Personal Information */}
              <div className="space-y-4 mb-6">
                <div>
                  <label htmlFor="name" className="block text-gray-700 text-sm font-medium mb-1">Full Name</label>
                  <input 
                    type="text" 
                    id="name" 
                    value={name} 
                    onChange={(e) => setName(e.target.value)} 
                    className="w-full bg-gray-50 border border-gray-300 rounded-lg px-4 py-2.5 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter your full name"
                  />
                </div>
                <div>
                  <label htmlFor="phone" className="block text-gray-700 text-sm font-medium mb-1">Phone Number</label>
                  <input 
                    type="tel" 
                    id="phone" 
                    value={phoneNumber} 
                    onChange={(e) => setPhoneNumber(e.target.value)} 
                    className="w-full bg-gray-50 border border-gray-300 rounded-lg px-4 py-2.5 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter your phone number"
                  />
                </div>
              </div>
              
              <div className="border-t border-gray-100 pt-6 mb-6">
                <label className="block text-gray-700 text-sm font-medium mb-3">Select a Day</label>
                <div className="flex space-x-2 overflow-x-auto pb-2">
                  {days.map((day) => (
                    <div 
                      key={day.date}
                      onClick={() => handleDayClick(day.date)}
                      className={`flex flex-col items-center justify-center ${
                        selectedDay === day.date 
                          ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md' 
                          : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                      } cursor-pointer rounded-lg transition-all duration-200 min-w-16 h-20 p-2`}
                    >
                      <span className="text-xs font-medium">{day.day}</span>
                      <span className="text-lg font-bold">{day.date}</span>
                      {day.isToday && (
                        <span className={`text-xs ${selectedDay === day.date ? 'text-white' : 'text-emerald-600'} mt-1`}>Today</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="mb-6">
                <label className="block text-gray-700 text-sm font-medium mb-3">Select a Time</label>
                <div className="grid grid-cols-3 gap-2">
                  {timeSlots.map((slot) => (
                    <button
                      key={slot}
                      onClick={() => handleSlotClick(slot)}
                      className={`py-2 px-2 rounded-lg transition-all duration-200 text-sm ${
                        selectedSlot === slot 
                          ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md' 
                          : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                      } flex items-center justify-center`}
                    >
                      <Clock size={14} className={`mr-1 ${selectedSlot === slot ? 'text-white' : 'text-gray-500'}`} />
                      {slot}
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Book Appointment Button */}
              <button 
                onClick={handleBookAppointment}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium py-3 px-4 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg flex items-center justify-center"
              >
                Book Appointment
                <svg className="w-5 h-5 ml-2" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewOneHome;