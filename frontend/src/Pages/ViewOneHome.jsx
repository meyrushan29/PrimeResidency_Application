import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const ViewOneHome = () => {
  const [apartment, setApartment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeImage, setActiveImage] = useState(0);
  const { id } = useParams(); // Get the ID from URL parameters
  const navigate = useNavigate();

  useEffect(() => {
    // Function to fetch apartment data
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Determine the URL based on whether we have an ID
        const url = id 
          ? `http://localhost:8001/api/apartments/${id}`
          : 'http://localhost:8001/api/apartments';
        
        console.log('Fetching from URL:', url);
        const response = await axios.get(url);
        console.log('API response:', response.data);

        // Process the response based on whether it's an array or single object
        let apartmentData;
        if (Array.isArray(response.data)) {
          // If it's an array (listing endpoint), use the first item
          if (response.data.length > 0) {
            apartmentData = response.data[0];
            console.log('Using first apartment from array:', apartmentData);
          } else {
            throw new Error('No apartments found');
          }
        } else {
          // If it's a single object (detail endpoint)
          apartmentData = response.data;
          console.log('Using single apartment data:', apartmentData);
        }
        
        setApartment(apartmentData);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError(`Failed to load apartment data: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    // Call the fetch function
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

  // Show loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4">
        <p className="font-bold">Error</p>
        <p>{error}</p>
        <button 
          onClick={handleBack}
          className="mt-2 text-blue-500 hover:text-blue-700"
        >
          Go back to all apartments
        </button>
      </div>
    );
  }

  // Show message if no apartment data
  if (!apartment) {
    return (
      <div className="text-center p-8">
        <p className="text-lg text-gray-600">No apartment data available</p>
        <button 
          onClick={handleBack}
          className="mt-2 text-blue-500 hover:text-blue-700"
        >
          Go back to all apartments
        </button>
      </div>
    );
  }

  // Render apartment details
  return (
    <div className="max-w-6xl mx-auto p-4">
      {/* Back button */}
      <button 
        className="mb-4 flex items-center text-blue-500 hover:text-blue-700"
        onClick={handleBack}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
        </svg>
        Back to all apartments
      </button>
      
      <h1 className="text-3xl font-bold mb-6">{apartment.title}</h1>
      
      {/* Image Gallery */}
      <div className="mb-8">
        {/* Main Image */}
        {apartment.images && apartment.images.length > 0 ? (
          <div className="h-96 bg-gray-200 mb-2 overflow-hidden rounded-lg">
            <img 
              src={`http://localhost:8001${apartment.images[activeImage]}`}
              alt={apartment.title}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.src = "https://via.placeholder.com/800x600?text=No+Image";
              }}
            />
          </div>
        ) : (
          <div className="h-96 bg-gray-200 flex items-center justify-center rounded-lg">
            <p>No images available</p>
          </div>
        )}
        
        {/* Image Thumbnails */}
        {apartment.images && apartment.images.length > 1 && (
          <div className="flex gap-2 overflow-x-auto py-2">
            {apartment.images.map((img, index) => (
              <div 
                key={index} 
                onClick={() => handleImageClick(index)}
                className={`w-24 h-24 flex-shrink-0 cursor-pointer ${
                  activeImage === index ? 'ring-2 ring-blue-500' : ''
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
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-semibold">Property Details</h2>
              <span className="text-2xl font-bold text-blue-600">
                ${apartment.price?.toLocaleString() || 'N/A'}
              </span>
            </div>
            
            <div className="grid grid-cols-2 gap-y-4 mb-6">
              <div>
                <p className="text-gray-500">Area</p>
                <p className="font-semibold">{apartment.area} sq ft</p>
              </div>
              
              <div>
                <p className="text-gray-500">Bedrooms</p>
                <p className="font-semibold">{apartment.bedrooms}</p>
              </div>
              
              <div>
                <p className="text-gray-500">Bathrooms</p>
                <p className="font-semibold">{apartment.bathrooms}</p>
              </div>
              
              <div>
                <p className="text-gray-500">Furnished</p>
                <p className="font-semibold">{apartment.furnished ? 'Yes' : 'No'}</p>
              </div>
              
              <div>
                <p className="text-gray-500">View</p>
                <p className="font-semibold">{apartment.view || 'N/A'}</p>
              </div>
              
              {apartment.createdAt && (
                <div>
                  <p className="text-gray-500">Listed on</p>
                  <p className="font-semibold">
                    {new Date(apartment.createdAt).toLocaleDateString()}
                  </p>
                </div>
              )}
            </div>
            
            <h3 className="text-xl font-semibold mb-2">Description</h3>
            <p className="text-gray-700">{apartment.description}</p>
          </div>
        </div>
        
        {/* Contact Info */}
        <div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Contact Agent</h2>
            
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6 text-blue-500">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div>
                <p className="font-medium">Property Agent</p>
                <p className="text-gray-500 text-sm">Available 24/7</p>
              </div>
            </div>
            
            <div className="space-y-3 mb-4">
              <p className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                agent@example.com
              </p>
              <p className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                (123) 456-7890
              </p>
            </div>
            
            <button className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 rounded font-medium transition">
              Contact Now
            </button>
          </div>
        </div>
      </div>
      
      {/* Additional Information */}
      <div className="bg-white p-6 rounded-lg shadow mb-8">
        <h2 className="text-2xl font-semibold mb-4">Location</h2>
        <div className="bg-gray-200 h-64 rounded flex items-center justify-center">
          <p className="text-gray-500">Map will be displayed here</p>
        </div>
      </div>
    </div>
  );
};

export default ViewOneHome;