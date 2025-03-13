import React from "react";
import { Bolt, ShieldCheck, Users, Building, Wifi, MapPin } from "lucide-react";

const features = [
  {
    icon: <Building size={28} />,
    title: "Modern & Luxurious",
    description: "Experience high-end living with elegant interiors and top-tier amenities designed for comfort.",
  },
  {
    icon: <ShieldCheck size={28} />,
    title: "Safe & Secure",
    description: "24/7 security and surveillance systems with controlled access for complete peace of mind.",
  },
  {
    icon: <Users size={28} />,
    title: "Community Living",
    description: "A welcoming environment with shared spaces designed to foster connections and social gatherings.",
  },
  {
    icon: <Wifi size={28} />,
    title: "Smart Living",
    description: "State-of-the-art technology integration with high-speed internet and smart home features.",
  },
  {
    icon: <MapPin size={28} />,
    title: "Prime Location",
    description: "Centrally located with easy access to shopping, dining, entertainment, and transportation.",
  },
  {
    icon: <Bolt size={28} />,
    title: "Energy Efficient",
    description: "Eco-friendly design with energy-saving appliances and sustainable building practices.",
  },
];

const WhyChooseUs = () => {
  return (
    <section className="py-20 px-6 bg-gray-900 text-white">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <span className="inline-block text-white text-sm uppercase tracking-wider mb-4 font-medium px-4 py-1 border border-white/20 rounded-full">
            Our Advantages
          </span>
          <h2 className="text-4xl font-bold text-white mb-6">
            Why Choose <span className="text-blue-500">Prime Residency</span>
          </h2>
          <p className="text-white/80 text-lg max-w-2xl mx-auto">
            We provide the perfect blend of comfort, security, and modern living for individuals and families looking for premium apartment experiences.
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-gray-800/50 backdrop-blur-sm border border-white/10 p-8 rounded-xl transition-all duration-300 hover:transform hover:-translate-y-2 hover:bg-gray-800/70"
            >
              <div className="w-12 h-12 bg-blue-600/20 text-blue-500 rounded-lg flex items-center justify-center mb-6">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">
                {feature.title}
              </h3>
              <p className="text-white/70">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="mt-16 text-center">
          <a 
            href="#apartments" 
            className="px-8 py-4 bg-blue-600 text-white rounded-full font-medium hover:bg-blue-700 transition-all duration-300 inline-flex items-center"
          >
            Explore Our Apartments
            <svg className="w-5 h-5 ml-2" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path>
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;