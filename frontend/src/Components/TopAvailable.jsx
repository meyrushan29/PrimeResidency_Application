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
          throw new Error('Fetched data is not an array or is not in the expected format');
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
      <div className="flex items-center justify-center h-64 bg-gray-900">
        <div className="text-white text-xl">Loading apartments...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64 bg-gray-900">
        <div className="text-red-500 text-xl">Error: {error}</div>
      </div>
    );
  }

  return (
    <section className="py-16 px-4 bg-gray-900">
      <div className="container mx-auto">
        {/* Section Header */}
        <div className="text-center mb-10">
          <span className="inline-block text-blue-600 text-sm uppercase tracking-wider mb-8 font-medium">
            Top Picks
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Featured Apartments</h2>
          <p className="text-gray-400 mb-20 max-w-2xl mx-auto">
            Explore our selection of premium apartments in prime locations with modern amenities.
          </p>
        </div>

        {/* Apartments Grid */}
        {apartments.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {apartments.map((apartment) => (
              <div
                key={apartment._id}
                className="bg-white rounded-lg overflow-hidden shadow-md transform transition-all duration-300 hover:-translate-y-2 hover:shadow-xl"
                onMouseEnter={() => setHoveredCard(apartment._id)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                <div className="relative overflow-hidden h-56">
                  {/* Image Handling */}
                  {apartment.images && apartment.images.length > 0 ? (
                    <img
                      src={`http://localhost:8001${apartment.images[0]}`}
                      alt={apartment.title}
                      className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-300 flex items-center justify-center">
                      <span className="text-gray-500">No image available</span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/60"></div>
                  <div className="absolute bottom-4 left-4">
                    <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                      LKR {apartment.price ? apartment.price.toLocaleString() : '0'}/month
                    </span>
                  </div>
                </div>

                <div className="p-5">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">{apartment.title || 'Untitled'}</h3>
                  <div className="flex items-center text-gray-500 mb-3">
                    <svg
                      className="w-4 h-4 mr-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                      ></path>
                    </svg>
                    <span>{apartment.area || 'N/A'} sq ft</span>
                  </div>

                  {/* Features List */}
                  <ul className="space-y-1 mb-4">
                    <li className="flex items-center text-gray-600 text-sm">
                      <svg className="w-4 h-4 mr-2 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        ></path>
                      </svg>
                      {apartment.bedrooms || '0'} Bedrooms
                    </li>
                    <li className="flex items-center text-gray-600 text-sm">
                      <svg className="w-4 h-4 mr-2 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        ></path>
                      </svg>
                      {apartment.bathrooms || '0'} Bathrooms
                    </li>
                    {apartment.furnished && (
                      <li className="flex items-center text-gray-600 text-sm">
                        <svg className="w-4 h-4 mr-2 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clipRule="evenodd"
                          ></path>
                        </svg>
                        Fully Furnished
                      </li>
                    )}
                    {apartment.view && (
                      <li className="flex items-center text-gray-600 text-sm">
                        <svg className="w-4 h-4 mr-2 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clipRule="evenodd"
                          ></path>
                        </svg>
                        {apartment.view}
                      </li>
                    )}
                  </ul>

                  <button
                    className="w-full bg-gray-100 hover:bg-blue-600 hover:text-white text-blue-600 rounded-md py-2 font-medium transition-colors duration-300"
                    onClick={() => navigate(`/viewonehome/${apartment._id}`)}
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center text-white text-lg mt-8">
            No apartments available at the moment. Please check back later.
          </div>
        )}

        {/* View All Button */}
        <div className="mt-10 text-center">
          <button 
            onClick={() => navigate('/availablehome')}
            className="bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-full font-medium transition-all duration-300 inline-flex items-center"
          >
            View All Apartments
            <svg className="w-4 h-4 ml-2" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path>
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
};

export default TopAvailableFlats;