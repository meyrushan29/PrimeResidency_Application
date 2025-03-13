import React from "react";
import { FaHome, FaCogs, FaShieldAlt, FaConciergeBell } from "react-icons/fa";

const services = [
  {
    icon: <FaHome className="text-6xl text-blue-600" />,
    title: "Luxury Residences",
    description: "Discover elegant and modern apartments designed for ultimate comfort and convenience."
  },
  {
    icon: <FaCogs className="text-6xl text-green-600" />,
    title: "24/7 Maintenance Support",
    description: "Our dedicated maintenance team ensures hassle-free living with prompt service."
  },
  {
    icon: <FaShieldAlt className="text-6xl text-red-600" />,
    title: "Advanced Security",
    description: "Enjoy peace of mind with state-of-the-art security systems and round-the-clock surveillance."
  },
  {
    icon: <FaConciergeBell className="text-6xl text-yellow-600" />,
    title: "Exclusive Concierge Services",
    description: "Personalized services to assist with your everyday needs, from bookings to deliveries."
  }
];

const Services = () => {
  return (
    <section className="py-20 bg-gray-900">
      <div className="container mx-auto px-6 text-center">
        <h2 className="text-5xl font-extrabold text-gray-200 mt-20 mb-12">Exceptional Services for a Premium Lifestyle</h2>
        <p className="text-lg text-white mb-8">At PrimeResidency, we prioritize your comfort and convenience with top-tier amenities.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {services.map((service, index) => (
            <div
              key={index}
              className="p-10 bg-white shadow-2xl rounded-2xl flex flex-col items-center hover:scale-105 transition-transform duration-300 hover:shadow-lg"
            >
              {service.icon}
              <h3 className="text-2xl font-semibold mt-5 text-gray-900">{service.title}</h3>
              <p className="text-gray-600 mt-3 text-center leading-relaxed">{service.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;