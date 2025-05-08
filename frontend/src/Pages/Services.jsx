import React from "react";
import { 
  Building2, 
  Wrench, 
  ShieldCheck, 
  Bell, 
  Wifi, 
  Dumbbell, 
  Car, 
  Coffee 
} from "lucide-react";

const services = [
  {
    icon: <Building2 size={28} />,
    title: "Luxury Residences",
    description: "Discover elegant and modern apartments designed for ultimate comfort and convenience.",
    gradient: "from-blue-600 to-indigo-600",
    bgGradient: "from-blue-50 to-indigo-50"
  },
  {
    icon: <Wrench size={28} />,
    title: "24/7 Maintenance Support",
    description: "Our dedicated maintenance team ensures hassle-free living with prompt service.",
    gradient: "from-emerald-600 to-teal-600",
    bgGradient: "from-emerald-50 to-teal-50"
  },
  {
    icon: <ShieldCheck size={28} />,
    title: "Advanced Security",
    description: "Enjoy peace of mind with state-of-the-art security systems and round-the-clock surveillance.",
    gradient: "from-rose-600 to-pink-600",
    bgGradient: "from-rose-50 to-pink-50"
  },
  {
    icon: <Bell size={28} />,
    title: "Exclusive Concierge Services",
    description: "Personalized services to assist with your everyday needs, from bookings to deliveries.",
    gradient: "from-amber-500 to-orange-600",
    bgGradient: "from-amber-50 to-orange-50"
  },
  {
    icon: <Wifi size={28} />,
    title: "High-Speed Internet",
    description: "Stay connected with complimentary high-speed fiber internet throughout the entire property.",
    gradient: "from-violet-600 to-purple-700",
    bgGradient: "from-violet-50 to-purple-50"
  },
  {
    icon: <Dumbbell size={28} />,
    title: "Fitness Center",
    description: "Modern gym facility with premium equipment and optional personal training services.",
    gradient: "from-cyan-600 to-blue-700",
    bgGradient: "from-cyan-50 to-blue-50"
  },
  {
    icon: <Car size={28} />,
    title: "Secure Parking",
    description: "Dedicated parking spaces with surveillance cameras and optional valet services.",
    gradient: "from-gray-700 to-gray-900",
    bgGradient: "from-gray-50 to-gray-100"
  },
  {
    icon: <Coffee size={28} />,
    title: "Community Lounge",
    description: "Elegant lounge areas for relaxation, socializing, and hosting private gatherings.",
    gradient: "from-yellow-600 to-amber-600",
    bgGradient: "from-yellow-50 to-amber-50"
  }
];

const Services = () => {
  return (
    <section className="py-28 bg-gradient-to-b from-gray-50 to-gray-100 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 z-0 opacity-10">
        <div className="absolute top-1/4 left-1/5 w-96 h-96 rounded-full bg-gradient-to-r from-blue-400 to-indigo-400 blur-3xl"></div>
        <div className="absolute bottom-1/3 right-1/4 w-80 h-80 rounded-full bg-gradient-to-r from-cyan-400 to-teal-400 blur-3xl"></div>
        <div className="absolute top-2/3 right-1/3 w-72 h-72 rounded-full bg-gradient-to-r from-amber-400 to-orange-400 blur-3xl"></div>
      </div>
      
      <div className="container mx-auto px-6 text-center relative z-10 max-w-7xl">
        <div className="mb-16">
          <div className="inline-block mb-4">
            <span className="inline-block px-5 py-2 rounded-full bg-blue-100 border border-blue-200 text-sm text-blue-700 font-medium tracking-wide">
              <span className="inline-block mr-2 w-2 h-2 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 animate-pulse"></span>
              PREMIUM AMENITIES
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-700 leading-tight mb-4">
            Exceptional Services for a Premium Lifestyle
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            At PrimeResidency, we prioritize your comfort and convenience with top-tier amenities designed to elevate your living experience.
          </p>
          <div className="h-1.5 w-24 bg-gradient-to-r from-blue-300 to-transparent mx-auto mt-7 rounded-full"></div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl shadow-lg overflow-hidden group hover:shadow-xl transition-all duration-500 hover:-translate-y-2"
            >
              <div className={`p-6 bg-gradient-to-br ${service.bgGradient} border-b border-gray-200`}>
                <div className={`w-16 h-16 bg-white rounded-2xl shadow-md flex items-center justify-center mx-auto text-transparent bg-clip-text bg-gradient-to-r ${service.gradient} transform group-hover:scale-110 transition-transform duration-300`}>
                  {service.icon}
                </div>
              </div>
              <div className="p-6">
                <h3 className={`text-xl font-bold mb-3 text-transparent bg-clip-text bg-gradient-to-r ${service.gradient}`}>
                  {service.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {service.description}
                </p>
              </div>
              <div className="px-6 pb-6">
                <a href="#learn-more" className={`text-sm font-medium text-transparent bg-clip-text bg-gradient-to-r ${service.gradient} flex items-center justify-center group-hover:underline`}>
                  Learn more
                  <svg className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform duration-300" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path>
                  </svg>
                </a>
              </div>
            </div>
          ))}
        </div>
        
        {/* Call to Action */}
        <div className="mt-20">
          <div className="bg-white p-10 rounded-3xl shadow-xl border border-gray-100 max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold mb-4">Experience Premium Living Today</h3>
            <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
              Book a tour to explore our exceptional amenities and see why PrimeResidency is the perfect place to call home.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a 
                href="#schedule-tour" 
                className="px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-full font-medium hover:shadow-lg hover:shadow-blue-200/50 transition-all duration-300 transform hover:-translate-y-1"
              >
                Schedule a Tour
              </a>
              <a 
                href="#contact-us" 
                className="px-8 py-4 bg-gray-100 text-gray-700 rounded-full font-medium hover:bg-gray-200 transition-colors duration-300"
              >
                Contact Us
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Services;