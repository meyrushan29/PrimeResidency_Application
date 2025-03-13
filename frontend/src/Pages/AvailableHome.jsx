import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import bed2 from '../assets/bed2.avif';
import bed3 from '../assets/bed3.jpg';
import spa from '../assets/spa.jpg';
import top4 from '../assets/top4.jpg';
import top5 from '../assets/top5.jpg';

const AvailableHomes = () => {
  const flatsData = [
    {
      id: 1,
      name: '2-Bedroom Apartment',
      price: 'LKR 150,000/month',
      size: '1,200 sq ft',
      image: bed2,
      features: ['2 Bathrooms', 'Fully Furnished', 'City View']
    },
    {
      id: 2,
      name: '3-Bedroom Apartment',
      price: 'LKR 180,000/month',
      size: '1,500 sq ft',
      image: bed3,
      features: ['3 Bathrooms', 'Modern Kitchen', 'Balcony']
    },
    {
      id: 3,
      name: 'Penthouse Suite',
      price: 'LKR 300,000/month',
      size: '2,500 sq ft',
      image: spa,
      features: ['4 Bathrooms', 'Private Terrace', 'Premium Fixtures']
    },
    {
      id: 4,
      name: 'Studio Apartment',
      price: 'LKR 100,000/month',
      size: '800 sq ft',
      image: top4,
      features: ['1 Bathroom', 'Open Floor Plan', 'Smart Home System']
    },
    {
      id: 5,
      name: '4-Bedroom Apartment',
      price: 'LKR 220,000/month',
      size: '1,800 sq ft',
      image: top5,
      features: ['3 Bathrooms', 'Family Room', 'Garden Access']
    },
  ];

  const [activeIndex, setActiveIndex] = useState(0);
  const [hoveredCard, setHoveredCard] = useState(null);
  const navigate = useNavigate();

  // Show only 3 flats for a cleaner preview
  const visibleFlats = flatsData.slice(0, 10);

  const handleViewAllClick = () => {
    navigate('/available-flats');
  };

  return (
    <section className="py-20 px-6 bg-gray-900">
      <div className="container mx-auto">
        {/* Featured Flats */}
        <div className="grid grid-cols-1 mt-24 md:grid-cols-3 gap-16">
          {visibleFlats.map((flat, index) => (
            <div
              key={flat.id}
              className="bg-white rounded-xl overflow-hidden shadow-lg transform transition-all duration-300 hover:-translate-y-2 hover:shadow-xl"
              onMouseEnter={() => setHoveredCard(index)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <div className="relative overflow-hidden h-64">
                <img 
                  src={flat.image} 
                  alt={flat.name} 
                  className="w-full h-full object-cover transition-transform duration-700 hover:scale-110" 
                />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/60"></div>
                <div className="absolute bottom-4 left-4">
                  <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                    {flat.price}
                  </span>
                </div>
              </div>
              
              <div className="p-6">
                <h3 className="text-xl font-semibold text-white mb-2">{flat.name}</h3>
                <div className="flex items-center text-gray-500 mb-4">
                  <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                  </svg>
                  <span>{flat.size}</span>
                </div>
                
                {/* Features List */}
                <ul className="space-y-2 mb-6">
                  {flat.features.map((feature, i) => (
                    <li key={i} className="flex items-center text-gray-600">
                      <svg className="w-4 h-4 mr-2 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>
                
                <button 
                  className="w-full bg-gray-100 hover:bg-blue-600 hover:text-white text-blue-600 rounded-lg py-3 font-medium transition-colors duration-300"
                  onClick={() => navigate(`/flat/${flat.id}`)}
                >
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AvailableHomes;