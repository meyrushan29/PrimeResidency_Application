import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const TopAvailableFlats = () => {
  const [apartments, setApartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hoveredCard, setHoveredCard] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTopApartments = async () => {
      try {
        setLoading(true);
        // Fetch exactly 3 apartments with a limit parameter
        const response = await fetch('http://localhost:8001/api/apartments?limit=3');
        
        if (!response.ok) {
          throw new Error('Failed to fetch top apartments');
        }
        
        const data = await response.json();

        // Check if data has the structure we expect
        if (data && data.success && Array.isArray(data.data)) {
          // Take only the first 3 apartments to ensure limit
          setApartments(data.data.slice(0, 3));
        } else {
          throw new Error('Fetched data is not in the expected format');
        }

        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchTopApartments();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 bg-gray-50">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 rounded-full border-4 border-indigo-500 border-t-transparent animate-spin mb-4"></div>
          <p className="text-indigo-600 font-medium">Loading premium apartments...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64 bg-gray-50">
        <div className="bg-red-50 text-red-600 px-6 py-4 rounded-lg border border-red-200 max-w-md">
          <div className="flex items-center mb-2">
            <svg className="w-6 h-6 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"></path>
            </svg>
            <span className="font-semibold">Error Loading Apartments</span>
          </div>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <section className="py-20 px-4 bg-gray-50 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 z-0 opacity-10">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 rounded-full bg-gradient-to-r from-blue-400 to-indigo-400 blur-3xl"></div>
        <div className="absolute bottom-1/3 left-1/5 w-80 h-80 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 blur-3xl"></div>
      </div>
      
      <div className="container mx-auto relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-block mb-4">
            <span className="inline-block px-5 py-2 rounded-full bg-blue-100 border border-blue-200 text-sm text-blue-700 font-medium tracking-wide">
              <span className="inline-block mr-2 w-2 h-2 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 animate-pulse"></span>
              FEATURED LISTINGS
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mt-4 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-700 mb-4">Premium Apartments</h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            Discover our handpicked selection of premium properties with modern amenities in prime locations.
          </p>
          <div className="h-1 w-24 bg-gradient-to-r from-blue-300 to-transparent mx-auto mt-8 rounded-full"></div>
        </div>

        {/* Apartments Grid */}
        {apartments.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {apartments.map((apartment) => (
              <div
                key={apartment._id}
                className={`bg-white rounded-xl overflow-hidden shadow-lg transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 ${
                  hoveredCard === apartment._id ? 'ring-2 ring-blue-500 ring-offset-2' : ''
                }`}
                onMouseEnter={() => setHoveredCard(apartment._id)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                <div className="relative overflow-hidden h-64">
                  {/* Image Handling */}
                  {apartment.images && apartment.images.length > 0 ? (
                    <img
                      src={`http://localhost:8001${apartment.images[0]}`}
                      alt={apartment.title}
                      className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                      <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/50"></div>
                  <div className="absolute top-4 right-4">
                    <span className="bg-blue-600 text-white px-4 py-1.5 rounded-full text-sm font-medium shadow-lg">
                      Available Now
                    </span>
                  </div>
                  <div className="absolute bottom-4 left-4">
                    <span className="bg-gradient-to-r from-indigo-600 to-blue-600 text-white px-4 py-1.5 rounded-full text-sm font-bold shadow-lg">
                      LKR {apartment.price ? apartment.price.toLocaleString() : '0'}/month
                    </span>
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-3">{apartment.title || 'Untitled'}</h3>
                  
                  <div className="flex items-center text-gray-500 mb-4">
                    <svg
                      className="w-5 h-5 text-blue-500 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      ></path>
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      ></path>
                    </svg>
                    <span className="text-gray-600">{apartment.location || 'Location unavailable'}</span>
                  </div>

                  {/* Features */}
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center mr-3">
                        <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
                        </svg>
                      </div>
                      <div>
                        <span className="block text-sm text-gray-500">Area</span>
                        <span className="font-medium text-gray-700">{apartment.area || 'N/A'} sq ft</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center mr-3">
                        <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
                        </svg>
                      </div>
                      <div>
                        <span className="block text-sm text-gray-500">Bedrooms</span>
                        <span className="font-medium text-gray-700">{apartment.bedrooms || '0'}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center mr-3">
                        <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                        </svg>
                      </div>
                      <div>
                        <span className="block text-sm text-gray-500">Bathrooms</span>
                        <span className="font-medium text-gray-700">{apartment.bathrooms || '0'}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center mr-3">
                        <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"></path>
                        </svg>
                      </div>
                      <div>
                        <span className="block text-sm text-gray-500">Features</span>
                        <span className="font-medium text-gray-700">
                          {apartment.furnished ? 'Furnished' : 'Unfurnished'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <button
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-lg py-3 font-medium transition-all duration-300 shadow-md hover:shadow-lg flex items-center justify-center"
                    onClick={() => navigate(`/viewonehome/${apartment._id}`)}
                  >
                    <span>View Details</span>
                    <svg className="w-5 h-5 ml-2" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white p-8 rounded-xl shadow-md text-center max-w-md mx-auto">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">No Apartments Available</h3>
            <p className="text-gray-600 mb-4">We're currently updating our inventory. Please check back soon for new premium listings.</p>
            <button onClick={() => window.location.reload()} className="text-blue-600 font-medium hover:text-blue-800 transition-colors">
              Refresh Page
            </button>
          </div>
        )}

        {/* View All Button */}
        {apartments.length > 0 && (
          <div className="mt-16 text-center">
            <button 
              onClick={() => navigate('/availablehome')}
              className="bg-white hover:bg-blue-50 text-blue-600 py-4 px-8 rounded-full font-medium transition-all duration-300 inline-flex items-center border border-blue-200 shadow-md hover:shadow-lg"
            >
              View All Available Properties
              <svg className="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform duration-300" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path>
              </svg>
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default TopAvailableFlats;