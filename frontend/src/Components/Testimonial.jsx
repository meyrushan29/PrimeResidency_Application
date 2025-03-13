import React from 'react';

const accentColorMap = {
  purple: "from-violet-500 to-purple-600",
  amber: "from-amber-500 to-orange-600",
  cyan: "from-cyan-500 to-blue-600",
  rose: "from-rose-500 to-pink-600",
  emerald: "from-emerald-500 to-green-600",
};

const Testimonial = () => {
  return (
    <div className="bg-gray-900 py-24 relative overflow-hidden"> 
      {/* Enhanced geometric shapes for visual interest */}
      <div className="absolute inset-0 z-0 opacity-20">
        <div className="absolute top-1/4 left-1/5 w-72 h-72 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 blur-3xl"></div>
        <div className="absolute bottom-1/3 right-1/4 w-96 h-96 rounded-full bg-gradient-to-r from-blue-500 to-teal-500 blur-3xl"></div>
        <div className="absolute top-2/3 right-1/2 w-64 h-64 rounded-full bg-gradient-to-r from-amber-500 to-red-500 blur-3xl"></div>
      </div>

      {/* Features Section with improved design */}
      <div className="relative z-10">
        <div className="container mx-auto px-6 md:px-12">
          <div className="text-center mb-20">
            <div className="inline-block mb-4">
              <span className="inline-block px-5 py-2 rounded-full bg-white/10 border border-white/20 text-sm text-white font-medium tracking-wide">
                <span className="inline-block mr-2 w-2 h-2 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 animate-pulse"></span>
                EXCLUSIVE OFFERINGS
              </span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mt-4 text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-blue-600">Premium Living Features</h2>
            <p className="mt-4 text-white/70 max-w-2xl mx-auto text-lg">Experience unparalleled luxury with amenities designed for those who appreciate the exceptional.</p>
            <div className="h-1 w-24 bg-gradient-to-r from-white/50 to-transparent mx-auto mt-6 rounded-full"></div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[ 
              { icon: "🏡", title: "Modern Design", desc: "Contemporary architecture with stylish finishes and attention to detail.", color: "purple" },
              { icon: "🛋️", title: "Spacious Layout", desc: "Open floor plans with abundant natural light and breathtaking views.", color: "amber" },
              { icon: "🏊", title: "Premium Amenities", desc: "Enjoy our infinity pool, state-of-the-art fitness center, and lounge areas.", color: "cyan" },
              { icon: "🌳", title: "Prime Location", desc: "Minutes away from shopping, fine dining, entertainment, and green spaces.", color: "rose" }
            ].map((feature, index) => (
              <div 
                key={index} 
                className="group bg-white/5 backdrop-blur-md p-8 rounded-2xl border border-white/10 transition-all duration-500 hover:-translate-y-2 hover:bg-white/10 hover:shadow-lg hover:shadow-blue-900/5"
              >
                <div className="mb-6 bg-gradient-to-br from-white/10 to-white/5 p-4 rounded-xl inline-block transform group-hover:scale-110 transition-transform duration-300">
                  <span className="text-4xl">{feature.icon}</span>
                </div>
                <h3 className={`text-xl font-bold mb-4 bg-gradient-to-r ${accentColorMap[feature.color]} bg-clip-text text-transparent`}>
                  {feature.title}
                </h3>
                <p className="text-white/70 leading-relaxed mb-6">{feature.desc}</p>
                <div className="pt-4 border-t border-white/10">
                  <a href="#learn-more" className="group inline-flex items-center text-sm font-medium text-white/70 hover:text-white transition-colors duration-300">
                    Explore details
                    <svg className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                    </svg>
                  </a>
                </div>
              </div>
            ))}
          </div>

          {/* Testimonial Preview with improved design */}
          <div className="mt-32">
            <div className="text-center mb-16">
              <span className="inline-block px-5 py-2 rounded-full bg-white/10 border border-white/20 text-sm text-white font-medium tracking-wide mb-4">
                <span className="inline-block mr-2 w-2 h-2 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 animate-pulse"></span>
                RESIDENT EXPERIENCES
              </span>
              <h2 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-600">What Our Residents Say</h2>
            </div>
            
            <div className="relative">
              {/* Enhanced quote decorative element */}
              <div className="absolute -top-10 -left-6 w-20 h-20 text-5xl opacity-10">
                <svg className="w-full h-full text-blue-500" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                </svg>
              </div>
              
              <div className="flex flex-col lg:flex-row items-center bg-gradient-to-br from-white/10 to-white/5 p-8 md:p-12 rounded-2xl border border-white/10 shadow-xl">
                <div className="lg:w-1/3 mb-10 lg:mb-0 flex justify-center">
                  <div className="relative">
                    <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white/20 shadow-lg">
                      <img 
                        src="https://randomuser.me/api/portraits/women/44.jpg" 
                        alt="Testimonial" 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="absolute -bottom-3 -right-3 bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-full w-12 h-12 flex items-center justify-center shadow-lg">
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                </div>
                <div className="lg:w-2/3 lg:pl-12">
                  <div className="flex mb-6">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <svg key={star} className="w-6 h-6 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <p className="text-white/90 italic mb-8 text-xl leading-relaxed font-light">"Moving to these apartments was the best decision I've made. The amenities are outstanding, the location is perfect, and the staff goes above and beyond. Truly a luxury living experience that exceeds all expectations."</p>
                  <div className="flex items-center">
                    <div>
                      <h4 className="font-bold text-xl text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-600">Sarah Johnson</h4>
                      <p className="text-white/60">Resident since 2023</p>
                    </div>
                    <div className="ml-auto">
                      <div className="flex space-x-4">
                        <button className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-white hover:bg-white/10 transition-all duration-300">
                          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                          </svg>
                        </button>
                        <button className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-white hover:bg-white/10 transition-all duration-300">
                          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Testimonial pagination indicators */}
            <div className="flex justify-center mt-8 space-x-2">
              {[1, 2, 3, 4].map((dot) => (
                <button 
                  key={dot} 
                  className={`h-2 rounded-full transition-all duration-300 ${
                    dot === 1 ? 'w-8 bg-amber-500' : 'w-2 bg-white/30 hover:bg-white/50'
                  }`}
                  aria-label={`Go to testimonial ${dot}`}
                ></button>
              ))}
            </div>
            
            <div className="mt-16 text-center">
              <a href="#testimonials" className="group inline-flex items-center px-8 py-4 bg-gradient-to-r from-amber-500 to-orange-600 rounded-full text-white font-medium transition-all duration-300 hover:shadow-lg hover:shadow-amber-600/20">
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
    </div>
  );
};

export default Testimonial;