import React, { useState } from "react";
import apartment from '../assets/apartment.jpeg';
import banner1 from '../assets/banner1.jpg';
import top4 from '../assets/top4.jpg';

const images = [
  { src: apartment, alt: "Apartment Image 1" },
  { src: banner1, alt: "Apartment Image 2" },
  { src: top4, alt: "Apartment Image 3" },
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
    <section className="py-16 bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          {/* Left Side - Text Content */}
          <div className="lg:w-1/2 space-y-6">
            <h2 className="text-4xl font-bold text-teal-500  tracking-tight">
              Discover Prime Residency
            </h2>
            
            <p className="text-lg text-white leading-relaxed">
              Experience luxury living in the heart of the city. Our modern apartments 
              are designed for comfort and convenience, offering premium amenities 
              to match your lifestyle.
            </p>
            
            <p className="text-lg text-white leading-relaxed">
              Choose from our range of living spaces, from cozy studios to spacious 
              penthouses, and enjoy a vibrant community with world-class services.
            </p>
            
            <button className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 px-6 rounded-lg transition duration-300 shadow-md">
              Learn More
            </button>
          </div>
          
          {/* Right Side - Image Carousel */}
          <div className="lg:w-1/2 relative">
            <div className="w-full h-96 overflow-hidden rounded-lg shadow-xl">
              {images.map((image, index) => (
                <div 
                  key={index}
                  className={`absolute inset-0 transition-opacity duration-500 ${
                    index === currentImageIndex ? "opacity-100" : "opacity-0"
                  }`}
                >
                  <img 
                    src={image.src} 
                    alt={image.alt} 
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
            
            {/* Navigation Buttons */}
            <div className="absolute inset-y-0 left-0 flex items-center">
              <button 
                onClick={prevImage}
                className="bg-white bg-opacity-50 hover:bg-opacity-70 p-2 rounded-r-lg text-gray-800 text-xl focus:outline-none"
                aria-label="Previous image"
              >
                ❮
              </button>
            </div>
            
            <div className="absolute inset-y-0 right-0 flex items-center">
              <button 
                onClick={nextImage}
                className="bg-white bg-opacity-50 hover:bg-opacity-70 p-2 rounded-l-lg text-gray-800 text-xl focus:outline-none"
                aria-label="Next image"
              >
                ❯
              </button>
            </div>
            
            {/* Image Indicators */}
            <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2">
              {images.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`w-3 h-3 rounded-full transition-colors duration-300 ${
                    index === currentImageIndex ? "bg-indigo-600" : "bg-gray-300"
                  }`}
                  aria-label={`Go to image ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;