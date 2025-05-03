import React, { useState } from 'react';

const accentColorMap = {
  purple: "from-violet-600 to-purple-700",
  amber: "from-amber-500 to-orange-600",
  cyan: "from-cyan-600 to-blue-700",
  rose: "from-rose-500 to-pink-600",
  emerald: "from-emerald-600 to-green-700",
};

// Feature data
const features = [
  { 
    icon: "🏡", 
    title: "Modern Design", 
    desc: "Contemporary architecture with stylish finishes and attention to detail.", 
    color: "purple" 
  },
  { 
    icon: "🛋️", 
    title: "Spacious Layout", 
    desc: "Open floor plans with abundant natural light and breathtaking views.", 
    color: "amber" 
  },
  { 
    icon: "🏊", 
    title: "Premium Amenities", 
    desc: "Enjoy our infinity pool, state-of-the-art fitness center, and lounge areas.", 
    color: "cyan" 
  },
  { 
    icon: "🌳", 
    title: "Prime Location", 
    desc: "Minutes away from shopping, fine dining, entertainment, and green spaces.", 
    color: "rose" 
  }
];

// Testimonial data
const testimonials = [
  {
    id: 1,
    name: "Sarah Johnson",
    position: "Resident since 2023",
    image: "https://randomuser.me/api/portraits/women/44.jpg",
    text: "Moving to these apartments was the best decision I've made. The amenities are outstanding, the location is perfect, and the staff goes above and beyond. Truly a luxury living experience that exceeds all expectations.",
    rating: 5
  },
  {
    id: 2,
    name: "Michael Chen",
    position: "Resident since 2022",
    image: "https://randomuser.me/api/portraits/men/32.jpg",
    text: "The attention to detail in every corner of this property is remarkable. From the modern fixtures to the responsive management team, everything exceeded my expectations. I couldn't be happier with my decision to live here.",
    rating: 5
  },
  {
    id: 3,
    name: "Jessica Williams",
    position: "Resident since 2024",
    image: "https://randomuser.me/api/portraits/women/63.jpg",
    text: "I've lived in several luxury apartments, but none compare to the level of service and quality found here. The community events are thoughtfully planned, and the amenities are always pristinely maintained.",
    rating: 5
  },
  {
    id: 4,
    name: "David Rodriguez",
    position: "Resident since 2023",
    image: "https://randomuser.me/api/portraits/men/67.jpg",
    text: "From the moment I toured the property, I knew this was home. The floor plans are intelligently designed, and the neighborhood offers everything I need within walking distance. Couldn't recommend it more highly.",
    rating: 5
  }
];

const Testimonial = () => {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [activeFeature, setActiveFeature] = useState(null);

  const nextTestimonial = () => {
    setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentTestimonial((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
  };

  return (
    <div className="bg-gradient-to-b from-gray-50 to-gray-100 py-28 relative overflow-hidden"> 
      {/* Enhanced geometric shapes with subtle animation */}
      <div className="absolute inset-0 z-0 opacity-10">
        <div className="absolute top-1/4 left-1/5 w-96 h-96 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 blur-3xl animate-pulse-slow"></div>
        <div className="absolute bottom-1/3 right-1/4 w-96 h-96 rounded-full bg-gradient-to-r from-blue-400 to-teal-400 blur-3xl animate-float"></div>
        <div className="absolute top-2/3 right-1/2 w-80 h-80 rounded-full bg-gradient-to-r from-amber-400 to-red-400 blur-3xl animate-pulse-slow"></div>
      </div>

      {/* Main content container with max-width for better alignment */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Features Section Header with improved spacing */}
        <div className="text-center mb-20">
          <div className="inline-block mb-5">
            <span className="inline-block px-5 py-2.5 rounded-full bg-indigo-100 border border-indigo-200 text-sm text-indigo-700 font-semibold tracking-wide shadow-sm">
              <span className="inline-block mr-2 w-2 h-2 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 animate-pulse"></span>
              EXCLUSIVE OFFERINGS
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mt-5 text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-blue-700 leading-tight max-w-4xl mx-auto">
            Premium Living Features
          </h2>
          <p className="mt-5 text-gray-600 max-w-2xl mx-auto text-lg">
            Experience unparalleled luxury with amenities designed for those who appreciate the exceptional.
          </p>
          <div className="h-1.5 w-24 bg-gradient-to-r from-indigo-300 to-transparent mx-auto mt-7 rounded-full"></div>
        </div>
        
        {/* Features Cards with improved layout and spacing */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-32">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className={`group bg-white p-8 rounded-2xl border border-gray-200 transition-all duration-500 hover:-translate-y-2 hover:shadow-xl ${
                activeFeature === index ? 'ring-2 ring-indigo-400 ring-offset-4' : ''
              }`}
              onMouseEnter={() => setActiveFeature(index)}
              onMouseLeave={() => setActiveFeature(null)}
            >
              <div className="mb-7 bg-gradient-to-br from-gray-50 to-gray-100 p-5 rounded-2xl inline-block transform group-hover:scale-110 transition-transform duration-300 shadow-sm">
                <span className="text-5xl">{feature.icon}</span>
              </div>
              <h3 className={`text-xl font-bold mb-4 bg-gradient-to-r ${accentColorMap[feature.color]} bg-clip-text text-transparent`}>
                {feature.title}
              </h3>
              <p className="text-gray-600 leading-relaxed mb-7">{feature.desc}</p>
              <div className="pt-4 border-t border-gray-100">
                <a href="#learn-more" className="group inline-flex items-center text-sm font-medium text-gray-600 hover:text-indigo-700 transition-colors duration-300">
                  Explore details
                  <svg className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                  </svg>
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* Testimonial Section with improved content alignment */}
        <div className="mb-20">
          <div className="text-center mb-16">
            <span className="inline-block px-5 py-2.5 rounded-full bg-amber-100 border border-amber-200 text-sm text-amber-700 font-semibold tracking-wide mb-5 shadow-sm">
              <span className="inline-block mr-2 w-2 h-2 rounded-full bg-gradient-to-r from-amber-500 to-orange-600 animate-pulse"></span>
              RESIDENT EXPERIENCES
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-orange-600 leading-tight max-w-4xl mx-auto">
              What Our Residents Say
            </h2>
            <div className="h-1.5 w-24 bg-gradient-to-r from-amber-300 to-transparent mx-auto mt-7 rounded-full"></div>
          </div>
          
          {/* Enhanced testimonial carousel with better structure */}
          <div className="relative max-w-5xl mx-auto">
            {/* Large decorative quote mark */}
            <div className="absolute -top-10 -left-6 md:-left-14 w-24 h-24 text-6xl opacity-10 z-0">
              <svg className="w-full h-full text-amber-500" fill="currentColor" viewBox="0 0 24 24">
                <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
              </svg>
            </div>
            
            {/* Modern glass-like testimonial card */}
            <div className="relative bg-white backdrop-blur-sm p-10 md:p-12 rounded-3xl border border-gray-200 shadow-xl overflow-hidden">
              {/* Subtle background pattern */}
              <div className="absolute inset-0 opacity-5">
                <svg className="w-full h-full" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                  <pattern id="dot-pattern" width="10" height="10" patternUnits="userSpaceOnUse">
                    <circle cx="5" cy="5" r="1" fill="currentColor" />
                  </pattern>
                  <rect width="100%" height="100%" fill="url(#dot-pattern)" />
                </svg>
              </div>
              
              {/* Content container with fixed height for consistent sizing */}
              <div className="relative z-10 min-h-[320px] md:min-h-[280px]">
                {testimonials.map((testimonial, index) => (
                  <div 
                    key={testimonial.id}
                    className={`transition-all duration-700 ease-in-out absolute inset-0 w-full ${
                      index === currentTestimonial 
                        ? "opacity-100 translate-x-0" 
                        : index < currentTestimonial 
                          ? "opacity-0 -translate-x-full" 
                          : "opacity-0 translate-x-full"
                    }`}
                  >
                    <div className="flex flex-col md:flex-row items-center gap-10">
                      {/* Profile image section with better alignment */}
                      <div className="md:w-1/3 flex justify-center">
                        <div className="relative">
                          <div className="w-32 h-32 md:w-36 md:h-36 rounded-full overflow-hidden border-4 border-amber-100 shadow-lg">
                            <img 
                              src={testimonial.image} 
                              alt={`${testimonial.name} testimonial`} 
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="absolute -bottom-3 -right-3 bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-full w-14 h-14 flex items-center justify-center shadow-lg">
                            <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                            </svg>
                          </div>
                        </div>
                      </div>
                      
                      {/* Testimonial content with better spacing */}
                      <div className="md:w-2/3 text-center md:text-left">
                        {/* Enhanced star rating */}
                        <div className="flex mb-6 justify-center md:justify-start">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <svg 
                              key={star} 
                              className={`w-6 h-6 text-amber-400 transition-all duration-300 ${
                                star <= testimonial.rating 
                                  ? 'opacity-100 scale-100' 
                                  : 'opacity-50 scale-75'
                              }`} 
                              fill="currentColor" 
                              viewBox="0 0 20 20"
                            >
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ))}
                        </div>
                        
                        {/* Testimonial text with better typography */}
                        <p className="text-gray-700 italic mb-8 text-lg md:text-xl leading-relaxed font-light">"{testimonial.text}"</p>
                        
                        {/* Author info with better alignment */}
                        <div>
                          <h4 className="font-bold text-xl text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-orange-600">
                            {testimonial.name}
                          </h4>
                          <p className="text-gray-500">{testimonial.position}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Improved navigation controls positioning */}
            <div className="absolute top-1/2 -translate-y-1/2 -left-5 md:-left-8">
              <button 
                onClick={prevTestimonial}
                className="bg-white/90 backdrop-blur-sm p-4 rounded-full shadow-lg text-gray-500 hover:text-amber-600 hover:bg-white hover:shadow-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2"
                aria-label="Previous testimonial"
              >
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                </svg>
              </button>
            </div>
            
            <div className="absolute top-1/2 -translate-y-1/2 -right-5 md:-right-8">
              <button 
                onClick={nextTestimonial}
                className="bg-white/90 backdrop-blur-sm p-4 rounded-full shadow-lg text-gray-500 hover:text-amber-600 hover:bg-white hover:shadow-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2"
                aria-label="Next testimonial"
              >
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
          
          {/* Enhanced pagination indicators with better spacing */}
          <div className="flex justify-center mt-12 space-x-3">
            {testimonials.map((_, index) => (
              <button 
                key={index}
                onClick={() => setCurrentTestimonial(index)}
                className={`transition-all duration-500 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2 ${
                  index === currentTestimonial 
                    ? 'w-12 h-3 bg-gradient-to-r from-amber-500 to-orange-600 rounded-full shadow-md' 
                    : 'w-3 h-3 bg-gray-300 hover:bg-gray-400 rounded-full'
                }`}
                aria-label={`Go to testimonial ${index + 1}`}
              ></button>
            ))}
          </div>
          
          {/* Enhanced CTA button with better positioning */}
          <div className="mt-16 text-center">
            <a 
              href="#testimonials" 
              className="group inline-flex items-center px-8 py-4 bg-gradient-to-r from-amber-500 to-orange-600 rounded-full text-white font-medium transition-all duration-300 hover:shadow-lg hover:shadow-amber-200/50 transform hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2"
            >
              Read all testimonials
              <span className="ml-2 transform group-hover:translate-x-1 transition-transform duration-300">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

/* Add these keyframe animations to your global CSS */
const globalStyles = `
@keyframes float {
  0% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
  100% { transform: translateY(0px); }
}

@keyframes pulse-slow {
  0%, 100% { opacity: 0.1; }
  50% { opacity: 0.15; }
}

.animate-float {
  animation: float 6s ease-in-out infinite;
}

.animate-pulse-slow {
  animation: pulse-slow 8s ease-in-out infinite;
}
`;

export default Testimonial;