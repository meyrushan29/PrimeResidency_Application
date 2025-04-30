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
    }
  ];

  const colorClasses = {
    blue: {
      border: 'border-blue-500',
      text: 'text-blue-700',
      bg: 'bg-blue-500',
      hover: 'hover:bg-blue-600'
    },
    red: {
      border: 'border-red-500',
      text: 'text-red-700',
      bg: 'bg-red-500',
      hover: 'hover:bg-red-600'
    },
    green: {
      border: 'border-green-500',
      text: 'text-green-700',
      bg: 'bg-green-500',
      hover: 'hover:bg-green-600'
    },
    indigo: {
      border: 'border-indigo-500',
      text: 'text-indigo-700',
      bg: 'bg-indigo-500',
      hover: 'hover:bg-indigo-600'
    }
  };

  const handleRequestNow = (path) => {
    navigate(path);
  };

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
        <p className="text-lg mt-2 text-gray-600">
          Everything you need for comfortable apartment living
        </p>
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
              className={`backdrop-blur-xl bg-white/70 p-6 rounded-2xl shadow-xl hover:scale-[1.03] hover:shadow-2xl transform transition-all duration-300 ${colorClasses[service.color].border}`}
            >
              <h2 className={`text-2xl font-bold mb-2 ${colorClasses[service.color].text}`}>
                {service.title}
              </h2>
              <p className="text-gray-700">{service.description}</p>
              <button
                onClick={() => handleRequestNow(service.path)}
                className={`mt-4 px-4 py-2 text-sm text-white rounded-lg transition duration-300 ${colorClasses[service.color].bg} ${colorClasses[service.color].hover}`}
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
