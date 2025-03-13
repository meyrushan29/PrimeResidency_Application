import React, { useState, useEffect, useRef } from 'react';
import banner1 from '../assets/banner1.jpg';
import banner2 from '../assets/banner2.jpg';
import banner3 from '../assets/banner3.jpg';
import banner4 from '../assets/banner4.jpg'; 
import banner5 from '../assets/banner5.jpg'; 
import banner6 from '../assets/banner6.jpg';       

const Header = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const heroRef = useRef(null);

  // Array of images for banner carousel with text overlays
  const bannerContent = [
    { 
      img: banner1, 
      title: "Elevate Your Lifestyle",
      subtitle: "Modern apartments in the heart of the city",
      color: "indigo",
      textColor: "text-white" 
    },
    { 
      img: banner2, 
      title: "Luxurious Comfort",
      subtitle: "Designed for those who appreciate the finer things",
      color: "amber",
      textColor: "text-white" 
    },
    { 
      img: banner3, 
      title: "Urban Living Redefined",
      subtitle: "Where style meets convenience",
      color: "cyan",
      textColor: "text-white" 
    },
    { 
      img: banner4, 
      title: "Premium Experience",
      subtitle: "Every detail meticulously crafted",
      color: "rose",
      textColor: "text-white" 
    },
    { 
      img: banner5, 
      title: "Exclusive Amenities",
      subtitle: "Elevating your everyday experience",
      color: "emerald",
      textColor: "text-white" 
    },
    { 
      img: banner6, 
      title: "Prestigious Locations",
      subtitle: "Prime addresses for discerning residents",
      color: "violet",
      textColor: "text-white" 
    }
  ];
  
  // Auto-rotate banner images
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((current) => (current + 1) % bannerContent.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [bannerContent.length]);

  // Set visibility on load
  useEffect(() => {
    setIsVisible(true);
    
    const handleIntersection = (entries) => {
      entries.forEach((entry) => {
        setIsVisible(entry.isIntersecting);
      });
    };
    
    const observer = new IntersectionObserver(handleIntersection, {
      threshold: 0.1
    });
    
    if (heroRef.current) {
      observer.observe(heroRef.current);
    }
    
    return () => {
      if (heroRef.current) {
        observer.unobserve(heroRef.current);
      }
    };
  }, []);

  // Get current banner content
  const currentBanner = bannerContent[activeIndex];

  return (
    <div ref={heroRef} className="relative h-screen overflow-hidden bg-gray-900">
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent z-10"></div>
      
      {/* Background images with smooth transition */}
      <div className="absolute inset-0">
        {bannerContent.map((content, index) => (
          <div 
            key={index}
            className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
              index === activeIndex ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
            }`}
          >
            <img 
              src={content.img} 
              alt={`Luxury Apartment ${index + 1}`} 
              className="w-full h-full object-cover"
            />
          </div>
        ))}
      </div>
      
      {/* Content container */}
      <div className="relative z-20 h-full w-full">
        <div className="container mx-auto h-full flex flex-col justify-center px-6 md:px-12">
          <div className="grid grid-cols-1 md:grid-cols-12 h-full items-center">
            {/* Main content area */}
            <div className="col-span-1 md:col-span-6 flex flex-col justify-center py-12 md:py-0">
              {/* Slide indicator with improved design */}
              <div className="flex items-center space-x-4 mb-8">
                <span className="font-mono text-white text-sm font-medium bg-white/10 px-3 py-1 rounded-full">
                  <span className="text-white">{String(activeIndex + 1).padStart(2, '0')}</span>
                  <span className="mx-2 text-white/50">/</span>
                  <span className="text-white/70">{String(bannerContent.length).padStart(2, '0')}</span>
                </span>
                
                <div className="h-px bg-gradient-to-r from-white to-transparent flex-grow max-w-xs"></div>
                
                <div className="flex space-x-3">
                  <button 
                    onClick={() => setActiveIndex((activeIndex - 1 + bannerContent.length) % bannerContent.length)}
                    className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-white hover:bg-white/10 transition-colors duration-300"
                    aria-label="Previous slide"
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  
                  <button 
                    onClick={() => setActiveIndex((activeIndex + 1) % bannerContent.length)}
                    className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-white hover:bg-white/10 transition-colors duration-300"
                    aria-label="Next slide"
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>
              
              {/* Main content with improved animation */}
              <div className={`transition-all duration-700 delay-300 transform ${isVisible ? 'translate-x-0 opacity-100' : '-translate-x-12 opacity-0'}`}>
                <span className="inline-block bg-white/10 text-white text-sm uppercase tracking-widest mb-4 font-medium px-4 py-2 rounded-full border border-white/10">
                  Premium Residences
                </span>
                
                <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight mb-6 drop-shadow-lg">
                  {currentBanner.title.split(' ').map((word, i) => (
                    <div key={i} className="overflow-hidden inline-block mr-3">
                      <span 
                        className="inline-block transform transition-transform duration-700" 
                        style={{ transitionDelay: `${500 + i * 100}ms` }}
                      >
                        {word}
                      </span>
                    </div>
                  ))}
                </h1>
                
                <p className="text-white/90 text-xl max-w-lg mb-10 drop-shadow-md font-light">
                  {currentBanner.subtitle}
                </p>
                
                <div className="flex flex-wrap gap-5">
                  <a 
                    href="#apartments" 
                    className="px-8 py-4 bg-white text-gray-900 rounded-full font-medium hover:bg-opacity-90 transition-all duration-300 shadow-lg flex items-center group"
                  >
                    View Properties
                    <svg className="w-5 h-5 ml-2 transform transition-transform duration-300 group-hover:translate-x-1" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </a>
                  
                  <a 
                    href="#contact" 
                    className="px-8 py-4 bg-transparent border border-white/30 text-white rounded-full font-medium hover:bg-white/10 transition-all duration-300"
                  >
                    Contact Us
                  </a>
                </div>
              </div>
            </div>
            
            {/* Feature highlights area with improved design */}
            <div className="hidden md:block md:col-span-5 md:col-start-8">
              <div className="grid grid-cols-2 gap-6">
                {[
                  { value: '98%', label: 'Satisfaction Rate', desc: 'From our residents' },
                  { value: '24/7', label: 'Concierge Service', desc: 'At your disposal' },
                  { value: '250+', label: 'Luxury Units', desc: 'Available now' },
                  { value: '4.9', label: 'Average Rating', desc: 'Across platforms' }
                ].map((stat, index) => (
                  <div 
                    key={index} 
                    className="bg-fuchsia-200/30 p-6 rounded-xl border border-white/50 transform transition-all duration-700 hover:scale-105 hover:bg-white/20 group"
                    style={{ transitionDelay: `${800 + index * 100}ms` }}
                  >
                    <div className="text-3xl font-bold text-white mb-2">{stat.value}</div>
                    <div className="text-sm font-medium text-white mb-1">{stat.label}</div>
                    <div className="text-xs text-white group-hover:text-white/90 transition-colors">{stat.desc}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Bottom indicators with improved design */}
      <div className="absolute bottom-8 left-0 right-0 z-20 px-6">
        <div className="container mx-auto">
          <div className="flex justify-center md:justify-start items-center space-x-3">
            {bannerContent.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveIndex(index)}
                className={`h-1.5 rounded-full transition-all duration-500 ${
                  index === activeIndex 
                    ? `w-12 bg-white shadow-md`
                    : 'w-4 bg-white/30 hover:bg-white/50'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              ></button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;