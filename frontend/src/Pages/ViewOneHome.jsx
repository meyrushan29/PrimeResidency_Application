import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const ViewOneHome = () => {
  const [apartment, setApartment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeImage, setActiveImage] = useState(0);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        console.log('Fetching apartment with ID:', id);
        
        // Make API call
        const response = await axios.get('http://localhost:8001/api/apartments');
        console.log('API response:', response.data);
        
        // Check if response has the expected structure
        if (!response.data || !response.data.data || !Array.isArray(response.data.data)) {
          throw new Error('Unexpected API response format');
        }
        
        const apartmentsArray = response.data.data;
        console.log('Apartments array:', apartmentsArray);
        
        // Find the apartment with matching ID or use first one if no ID
        let apartmentData;
        if (id) {
          apartmentData = apartmentsArray.find(apt => apt._id === id);
          if (!apartmentData) {
            throw new Error(`Apartment with ID ${id} not found`);
          }
        } else if (apartmentsArray.length > 0) {
          apartmentData = apartmentsArray[0]; // Use first apartment if no ID specified
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

  // Handle image change
  const handleImageClick = (index) => {
    setActiveImage(index);
  };

  // Go back to all apartments
  const handleBack = () => {
    navigate('/apartments');
  };

  // Debug rendering
  console.log('Rendering with apartment:', apartment);
  console.log('Loading state:', loading);
  console.log('Error state:', error);

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
          <button 
            onClick={handleBack}
            className="mt-2 text-blue-300 hover:text-blue-100"
          >
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
        <button 
          onClick={handleBack}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          Go back to all apartments
        </button>
      </div>
    );
  }

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
                  e.target.src = "https://via.placeholder.com/800x600?text=No+Image";
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
                      e.target.src = "https://via.placeholder.com/100?text=Thumb";
                    }}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
        
        {/* Property Details */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Basic Info */}
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
                    {apartment.furnished ? 
                      <span className="text-green-400">Yes</span> : 
                      <span className="text-red-400">No</span>
                    }
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
      </div>
    </div>
  );
};

export default ViewOneHome;