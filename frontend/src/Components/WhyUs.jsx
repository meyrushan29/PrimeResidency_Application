import React from "react";
import { Bolt, ShieldCheck, Users, Building, Wifi, MapPin } from "lucide-react";

const features = [
  {
    icon: <Building size={28} />,
    title: "Modern & Luxurious",
    description: "Experience high-end living with elegant interiors and top-tier amenities designed for comfort.",
    color: "from-indigo-600 to-blue-600"
  },
  {
    icon: <ShieldCheck size={28} />,
    title: "Safe & Secure",
    description: "24/7 security and surveillance systems with controlled access for complete peace of mind.",
    color: "from-emerald-600 to-teal-600"
  },
  {
    icon: <Users size={28} />,
    title: "Community Living",
    description: "A welcoming environment with shared spaces designed to foster connections and social gatherings.",
    color: "from-amber-500 to-orange-600"
  },
  {
    icon: <Wifi size={28} />,
    title: "Smart Living",
    description: "State-of-the-art technology integration with high-speed internet and smart home features.",
    color: "from-violet-600 to-purple-700"
  },
  {
    icon: <MapPin size={28} />,
    title: "Prime Location",
    description: "Centrally located with easy access to shopping, dining, entertainment, and transportation.",
    color: "from-rose-500 to-pink-600"
  },
  {
    icon: <Bolt size={28} />,
    title: "Energy Efficient",
    description: "Eco-friendly design with energy-saving appliances and sustainable building practices.",
    color: "from-cyan-600 to-blue-700"
  },
];

const WhyChooseUs = () => {
  return (
    <section className="py-28 px-4 bg-gradient-to-b from-gray-50 to-gray-100 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 z-0 opacity-10">
        <div className="absolute top-1/4 left-1/5 w-96 h-96 rounded-full bg-gradient-to-r from-blue-400 to-indigo-400 blur-3xl"></div>
        <div className="absolute bottom-1/3 right-1/5 w-80 h-80 rounded-full bg-gradient-to-r from-teal-400 to-emerald-400 blur-3xl"></div>
        <div className="absolute top-2/3 right-1/3 w-72 h-72 rounded-full bg-gradient-to-r from-amber-400 to-orange-400 blur-3xl"></div>
      </div>
      
      <div className="container mx-auto max-w-7xl relative z-10">
        <div className="text-center mb-20">
          <div className="inline-block mb-5">
            <span className="inline-block px-5 py-2.5 rounded-full bg-blue-100 border border-blue-200 text-sm text-blue-700 font-semibold tracking-wide shadow-sm">
              <span className="inline-block mr-2 w-2 h-2 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 animate-pulse"></span>
              OUR ADVANTAGES
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mt-5 leading-tight">
            Why Choose <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-700">Prime Residency</span>
          </h2>
          <p className="mt-5 text-gray-600 max-w-2xl mx-auto text-lg">
            We provide the perfect blend of comfort, security, and modern living for individuals and families looking for premium apartment experiences.
          </p>
          <div className="h-1.5 w-24 bg-gradient-to-r from-blue-300 to-transparent mx-auto mt-7 rounded-full"></div>
        </div>

        {/* Feature Cards - Enhanced Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group bg-white p-8 rounded-2xl border border-gray-200 transition-all duration-500 hover:-translate-y-2 hover:shadow-xl hover:shadow-blue-100"
            >
              <div className={`w-16 h-16 bg-gradient-to-br ${feature.color} bg-opacity-10 rounded-2xl flex items-center justify-center mb-6 text-white shadow-md transform group-hover:scale-110 transition-transform duration-300`}>
                {feature.icon}
              </div>
              <h3 className={`text-xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r ${feature.color}`}>
                {feature.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* Enhanced Call to Action */}
        <div className="text-center mt-16">
          <a 
            href="#apartments" 
            className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-full font-medium transition-all duration-300 hover:shadow-lg hover:shadow-blue-200/50 transform hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Explore Our Apartments
            <svg className="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform duration-300" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path>
            </svg>
          </a>
          
          <div className="flex flex-wrap justify-center mt-10 gap-6">
            {/* Stats */}
            <div className="flex items-center space-x-2 text-gray-600">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
              </div>
              <div>
                <span className="text-sm font-medium">4.9/5 Rating</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-2 text-gray-600">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <div>
                <span className="text-sm font-medium">500+ Happy Residents</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-2 text-gray-600">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <span className="text-sm font-medium">15 Years Experience</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;