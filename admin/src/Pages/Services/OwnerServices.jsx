

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const OwnerServices = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

  const services = [
    {
      title: '🧹 Cleaning Services',
      description: 'Daily or weekly professional cleaning for flats and shared spaces.',
      color: 'blue',
      path: '/cleaningform'
    },
    {
      title: '🩺 Health Services',
      description: 'Medical assistance, doctor visits, and emergency response.',
      color: 'red',
      path: '/healthform'
    },
    {
      title: '🍽️ Food Services',
      description: 'Meal plans, tiffin delivery, and on-demand food requests.',
      color: 'green',
      path: '/foodform'
    },
    {
      title: '🛡️ Security Services',
      description: '24/7 surveillance, gated access, and security personnel.',
      color: 'indigo',
      path: '/securityform'
    },
    {
      title: '🧺 Laundry Services',
      description: 'Pick-up and drop-off laundry and dry-cleaning services.',
      color: 'blue',
      path: '/laundryform'
    },
    {
      title: '🛠️ Maintenance Services',
      description: 'Quick response for electrical, plumbing, and appliance repair.',
      color: 'red',
      path: '/maintenanceform'
    },
    {
      title: '🚗 Parking Management',
      description: 'Secure resident and visitor parking, spot allocation.',
      color: 'green',
      path: '/parkingform'
    },
    {
      title: '🎉 Community Events',
      description: 'Festivals, games, and cultural evenings for social bonding.',
      color: 'indigo',
      path: '/communityform'
    },
    {
      title: '🌐 Internet & Cable',
      description: 'High-speed Wi-Fi and TV setup assistance.',
      color: 'blue',
      path: '/internetform'
    },
    {
      title: '🗑️ Waste Management',
      description: 'Daily collection, recycling, and clean disposal.',
      color: 'red',
      path: '/wasteform'
    }
  ];

  const handleRequestNow = (path) => {
    navigate(path);
  };

  // Filter only based on service title (not description)
  const filteredServices = services.filter((service) =>
    service.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-white p-10">
      {/* Heading */}
      <div className="text-center mb-8">
        <h1 className="text-5xl font-extrabold text-blue-800 drop-shadow-md tracking-wide">
          🏢 Owner Services
        </h1>
        <p className="text-lg mt-2 text-gray-600">Everything you need for comfortable apartment living</p>
      </div>

      {/* Search Bar */}
      <div className="flex justify-center mb-10">
        <input
          type="text"
          placeholder="Search service titles..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full max-w-md px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
        {filteredServices.length > 0 ? (
          filteredServices.map((service, index) => (
            <div
              key={index}
              className={`backdrop-blur-xl bg-white/70 p-6 rounded-2xl shadow-xl hover:scale-[1.03] hover:shadow-2xl transform transition-all duration-300 border-l-4 border-${service.color}-500`}
            >
              <h2 className={`text-2xl font-bold mb-2 text-${service.color}-700`}>
                {service.title}
              </h2>
              <p className="text-gray-700">{service.description}</p>
              <button
                onClick={() => handleRequestNow(service.path)}
                className={`mt-4 px-4 py-2 text-sm text-white rounded-lg transition duration-300 bg-${service.color}-500 hover:bg-${service.color}-600`}
              >
                Request Now
              </button>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center text-gray-500 text-lg">
            No services match your search.
          </div>
        )}
      </div>
    </div>
  );
};

export default OwnerServices;
