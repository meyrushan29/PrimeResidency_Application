import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building, Home, Eye, CheckCircle2, BedDouble, Bath, MapPin, Thermometer, ArrowRight } from 'lucide-react';

const AvailableHomes = () => {
  const [apartments, setApartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hoveredCard, setHoveredCard] = useState(null);
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchApartments = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:8001/api/apartments');
        
        if (!response.ok) {
          throw new Error('Failed to fetch apartments');
        }
        
        const data = await response.json();

        // Check if data has the structure we expect
        if (data && data.success && Array.isArray(data.data)) {
          setApartments(data.data);
        } else {
          throw new Error('Fetched data is not in the expected format');
        }

        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchApartments();
  }, []);

  // Filter options
  const filters = [
    { id: 'all', label: 'All Properties' },
    { id: 'apartment', label: 'Apartments' },
    { id: 'furnished', label: 'Furnished' },
    { id: 'premium', label: 'Premium' }
  ];

  // Filter and search apartments
  const filteredApartments = apartments
    .filter(apt => {
      // Apply category filter
      if (selectedFilter === 'all') return true;
      if (selectedFilter === 'furnished') return apt.furnished;
      if (selectedFilter === 'premium') return apt.price && apt.price > 50000;
      return apt.type === selectedFilter;
    })
    .filter(apt => {
      // Apply search filter
      if (!searchTerm) return true;
      
      const lowerSearchTerm = searchTerm.toLowerCase();
      return (
        (apt.title && apt.title.toLowerCase().includes(lowerSearchTerm)) ||
        (apt.location && apt.location.toLowerCase().includes(lowerSearchTerm)) ||
        (apt.description && apt.description.toLowerCase().includes(lowerSearchTerm))
      );
    });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 border-4 border-t-blue-600 border-b-blue-600 border-l-transparent border-r-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-gray-700 font-medium">Loading available properties...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="bg-white p-8 rounded-2xl shadow-xl border border-red-100 max-w-md">
          <div className="flex items-center mb-4 text-red-500">
            <svg className="w-8 h-8 mr-3" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="text-xl font-semibold">Error Loading Properties</h3>
          </div>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="w-full bg-blue-600 text-white py-3 rounded-xl font-medium hover:bg-blue-700 transition-colors flex items-center justify-center"
          >
            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <section className="py-24 px-4 bg-gradient-to-b from-gray-50 to-gray-100 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 z-0 opacity-10">
        <div className="absolute top-1/4 left-1/5 w-96 h-96 rounded-full bg-gradient-to-r from-blue-400 to-indigo-400 blur-3xl"></div>
        <div className="absolute bottom-1/3 right-1/5 w-80 h-80 rounded-full bg-gradient-to-r from-cyan-400 to-teal-400 blur-3xl"></div>
      </div>

      <div className="container mx-auto max-w-7xl relative z-10">
        {/* Header Section */}
        <div className="text-center mb-16">
          <div className="inline-block mb-4">
            <span className="inline-block px-5 py-2 rounded-full bg-blue-100 border border-blue-200 text-sm text-blue-700 font-medium tracking-wide">
              <span className="inline-block mr-2 w-2 h-2 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 animate-pulse"></span>
              FIND YOUR DREAM HOME
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-700 mb-5">
            Available Properties
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Explore our selection of premium properties designed for modern living with luxurious amenities and prime locations.
          </p>
        </div>

        {/* Search and Filter Bar */}
        <div className="bg-white rounded-2xl shadow-md p-4 mb-10">
          <div className="flex flex-col md:flex-row items-center gap-4">
            {/* Search Input */}
            <div className="flex-grow relative">
              <div className="absolute inset-y-0 left-3 flex items-center text-gray-400">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Search by location, name, or features..."
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Filter Buttons */}
            <div className="flex flex-wrap gap-2">
              {filters.map((filter) => (
                <button
                  key={filter.id}
                  onClick={() => setSelectedFilter(filter.id)}
                  className={`px-5 py-3 rounded-xl text-sm font-medium transition-all duration-300 ${
                    selectedFilter === filter.id
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {filter.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="flex justify-between items-center mb-8">
          <p className="text-gray-600">
            <span className="font-semibold text-gray-800">{filteredApartments.length}</span> properties found
          </p>
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-500">Sort by:</span>
            <select className="bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="newest">Newest</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="size">Size</option>
            </select>
          </div>
        </div>

        {/* Apartments Grid */}
        {filteredApartments.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredApartments.map((apartment) => (
              <div
                key={apartment._id}
                className={`bg-white rounded-2xl overflow-hidden shadow-lg transition-all duration-500 hover:-translate-y-2 hover:shadow-xl ${
                  hoveredCard === apartment._id ? 'ring-2 ring-blue-400 ring-offset-2' : ''
                }`}
                onMouseEnter={() => setHoveredCard(apartment._id)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                <div className="relative overflow-hidden h-64">
                  {/* Property Type Badge */}
                  <div className="absolute top-4 left-4 z-10">
                    <span className="bg-white/90 backdrop-blur-sm text-blue-600 px-3 py-1 rounded-full text-xs font-semibold shadow-sm">
                      {apartment.type || 'Apartment'}
                    </span>
                  </div>
                  
                  {/* Image Handling */}
                  {apartment.images && apartment.images.length > 0 ? (
                    <img
                      src={`http://localhost:8001${apartment.images[0]}`}
                      alt={apartment.title}
                      className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                      <Building size={48} className="text-gray-400" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/60"></div>
                  <div className="absolute bottom-4 left-4">
                    <span className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-1.5 rounded-full text-sm font-bold shadow-lg">
                      LKR {apartment.price ? apartment.price.toLocaleString() : '0'}/month
                    </span>
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-2">{apartment.title || 'Untitled'}</h3>
                  
                  {/* Location */}
                  <div className="flex items-center text-gray-500 mb-5">
                    <MapPin size={18} className="mr-2 text-blue-500" />
                    <span className="text-gray-600">{apartment.location || 'Location unavailable'}</span>
                  </div>

                  {/* Features Grid */}
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center mr-2">
                        <BedDouble size={16} className="text-blue-600" />
                      </div>
                      <div>
                        <span className="text-sm text-gray-500">Bedrooms</span>
                        <p className="text-gray-700 font-medium">{apartment.bedrooms || '0'}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center mr-2">
                        <Bath size={16} className="text-blue-600" />
                      </div>
                      <div>
                        <span className="text-sm text-gray-500">Bathrooms</span>
                        <p className="text-gray-700 font-medium">{apartment.bathrooms || '0'}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center mr-2">
                        <Home size={16} className="text-blue-600" />
                      </div>
                      <div>
                        <span className="text-sm text-gray-500">Area</span>
                        <p className="text-gray-700 font-medium">{apartment.area || 'N/A'} sq ft</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center mr-2">
                        {apartment.furnished ? (
                          <CheckCircle2 size={16} className="text-blue-600" />
                        ) : (
                          <Thermometer size={16} className="text-blue-600" />
                        )}
                      </div>
                      <div>
                        <span className="text-sm text-gray-500">Status</span>
                        <p className="text-gray-700 font-medium">
                          {apartment.furnished ? 'Furnished' : 'Unfurnished'}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Highlighted Features */}
                  {apartment.view && (
                    <div className="mb-6 flex items-start">
                      <div className="w-8 h-8 rounded-full bg-blue-50 flex-shrink-0 flex items-center justify-center mr-2 mt-0.5">
                        <Eye size={16} className="text-blue-600" />
                      </div>
                      <div>
                        <span className="text-sm text-gray-500 block mb-1">View</span>
                        <p className="text-gray-700">{apartment.view}</p>
                      </div>
                    </div>
                  )}

                  <button
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl py-3.5 font-medium transition-all duration-300 shadow-md hover:shadow-lg flex items-center justify-center group"
                    onClick={() => navigate(`/viewonehome/${apartment._id}`)}
                  >
                    <span>View Details</span>
                    <ArrowRight size={18} className="ml-2 transform transition-transform duration-300 group-hover:translate-x-1" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white p-8 rounded-2xl shadow-lg text-center max-w-lg mx-auto">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Home size={24} className="text-blue-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">No properties available</h3>
            <p className="text-gray-600 mb-6">
              {searchTerm ? 'No properties match your search criteria. Try adjusting your filters or search term.' : 'We\'re currently updating our inventory with new premium listings. Please check back soon.'}
            </p>
            {searchTerm && (
              <button 
                onClick={() => {setSearchTerm(''); setSelectedFilter('all');}}
                className="px-6 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors inline-flex items-center"
              >
                Clear Filters
              </button>
            )}
          </div>
        )}
        
        {/* Pagination Section */}
        {filteredApartments.length > 0 && (
          <div className="flex justify-center mt-12">
            <div className="inline-flex items-center bg-white rounded-full shadow-md p-1">
              <button className="w-10 h-10 rounded-full text-gray-500 hover:bg-gray-100 flex items-center justify-center">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              
              {[1, 2, 3].map((pageNum) => (
                <button 
                  key={pageNum}
                  className={`w-10 h-10 rounded-full ${
                    pageNum === 1 
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white' 
                      : 'text-gray-700 hover:bg-gray-100'
                  } flex items-center justify-center font-medium text-sm transition-colors`}
                >
                  {pageNum}
                </button>
              ))}
              
              <button className="w-10 h-10 rounded-full text-gray-500 hover:bg-gray-100 flex items-center justify-center">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default AvailableHomes;