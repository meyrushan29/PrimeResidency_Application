import React, { useState } from "react";
import apartment from '../assets/apartment.jpeg';
import banner1 from '../assets/banner1.jpg';
import top4 from '../assets/top4.jpg';

const images = [
  { src: apartment, alt: "Apartment Image 1" },
  { src: banner1, alt: "Apartment Image 2" },
  { src: top4, alt: "Apartment Image 3" },
];

// Feature icons for the modern layout
const features = [
  { 
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
      </svg>
    ),
    title: "Premium Location",
    description: "Located in the heart of the city with easy access to all amenities."
  },
  { 
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    ),
    title: "Modern Design",
    description: "Contemporary architecture with elegant finishes throughout."
  },
  { 
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
      </svg>
    ),
    title: "Smart Living",
    description: "Integrated smart home technology for comfort and convenience."
  }
];

const About = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const nextImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  return (
    <section className="py-24 bg-gray-50 relative overflow-hidden">
      {/* Enhanced background decoration with multiple elements */}
      <div className="absolute inset-0 z-0 opacity-10">
        <div className="absolute top-1/3 right-1/4 w-80 h-80 rounded-full bg-gradient-to-r from-teal-400 to-blue-400 blur-3xl"></div>
        <div className="absolute bottom-1/4 left-1/5 w-72 h-72 rounded-full bg-gradient-to-r from-indigo-400 to-purple-400 blur-3xl"></div>
        <div className="absolute top-3/4 right-1/3 w-64 h-64 rounded-full bg-gradient-to-r from-amber-400 to-orange-400 blur-3xl"></div>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        {/* Modern grid layout for content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left Side - Enhanced Text Content */}
          <div className="space-y-8 order-2 lg:order-1">
            <div>
              <div className="inline-block mb-4">
                <span className="inline-block px-5 py-2 rounded-full bg-teal-100 border border-teal-200 text-sm text-teal-700 font-medium tracking-wide">
                  <span className="inline-block mr-2 w-2 h-2 rounded-full bg-gradient-to-r from-teal-500 to-blue-500 animate-pulse"></span>
                  OUR STORY
                </span>
              </div>
              
              <h2 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-blue-600 tracking-tight">
                Discover Prime Residency
              </h2>
            </div>
            
            <p className="text-lg text-gray-700 leading-relaxed">
              Experience luxury living in the heart of the city. Our modern apartments 
              are designed for comfort and convenience, offering premium amenities 
              to match your lifestyle.
            </p>
            
            {/* Feature cards in a modern grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
              {features.map((feature, index) => (
                <div key={index} className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100">
                  <div className="w-12 h-12 bg-gradient-to-br from-teal-500/10 to-blue-500/10 rounded-lg flex items-center justify-center mb-4 text-teal-600">
                    {feature.icon}
                  </div>
                  <h3 className="font-semibold text-gray-800 mb-2">{feature.title}</h3>
                  <p className="text-sm text-gray-600">{feature.description}</p>
                </div>
              ))}
            </div>
            
            <div className="pt-4 flex flex-wrap gap-4">
              <button className="bg-gradient-to-r from-teal-600 to-blue-600 hover:from-teal-700 hover:to-blue-700 text-white font-medium py-3 px-8 rounded-full transition duration-300 shadow-md hover:shadow-lg hover:shadow-teal-100 flex items-center">
                Learn More
                <svg className="w-5 h-5 ml-2" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </button>
              
              <button className="bg-white text-teal-600 border border-teal-200 hover:bg-teal-50 font-medium py-3 px-8 rounded-full transition duration-300 shadow-sm hover:shadow-md flex items-center">
                Take a Tour
                <svg className="w-5 h-5 ml-2" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </button>
            </div>
          </div>
          
          {/* Right Side - Enhanced Image Carousel */}
          <div className="relative order-1 lg:order-2">
            {/* Decorative element */}
            <div className="absolute -top-8 -right-8 w-24 h-24 bg-teal-100 rounded-full opacity-70 z-0"></div>
            <div className="absolute -bottom-8 -left-8 w-16 h-16 bg-blue-100 rounded-full opacity-70 z-0"></div>
            
            <div className="relative">
              {/* Main image container with enhanced styling */}
              <div className="w-full h-[500px] overflow-hidden rounded-2xl shadow-xl border border-gray-200 relative z-10">
                {images.map((image, index) => (
                  <div 
                    key={index}
                    className={`absolute inset-0 transition-all duration-700 ease-in-out ${
                      index === currentImageIndex 
                        ? "opacity-100 scale-100" 
                        : "opacity-0 scale-105"
                    }`}
                  >
                    <img 
                      src={image.src} 
                      alt={image.alt} 
                      className="w-full h-full object-cover"
                    />
                    
                    {/* Enhanced overlay with subtle gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-black/10 to-transparent opacity-60"></div>
                  </div>
                ))}
                
                {/* Status indicator */}
                <div className="absolute top-6 right-6 bg-white/80 backdrop-blur-sm px-3 py-1.5 rounded-full text-xs font-medium text-gray-700 shadow-md">
                  {currentImageIndex + 1} / {images.length}
                </div>
              </div>
              
              {/* Modern navigation controls */}
              <div className="absolute inset-y-0 left-0 flex items-center z-20">
                <button 
                  onClick={prevImage}
                  className="ml-4 bg-white/90 backdrop-blur-sm hover:bg-white p-4 rounded-full text-teal-700 shadow-lg transition duration-300 focus:outline-none hover:scale-105"
                  aria-label="Previous image"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
              </div>
              
              <div className="absolute inset-y-0 right-0 flex items-center z-20">
                <button 
                  onClick={nextImage}
                  className="mr-4 bg-white/90 backdrop-blur-sm hover:bg-white p-4 rounded-full text-teal-700 shadow-lg transition duration-300 focus:outline-none hover:scale-105"
                  aria-label="Next image"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
              
              {/* Enhanced image indicators */}
              <div className="absolute -bottom-6 left-0 right-0 flex justify-center space-x-3 z-20">
                {images.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${
                      index === currentImageIndex 
                        ? "bg-gradient-to-r from-teal-600 to-blue-600 scale-125" 
                        : "bg-gray-300 hover:bg-gray-400"
                    }`}
                    aria-label={`Go to image ${index + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;