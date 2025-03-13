import React, { useRef, useState } from 'react';
import emailjs from '@emailjs/browser';

const Contact = () => {
  const form = useRef();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const sendEmail = (e) => {
    e.preventDefault();
    setIsLoading(true);

    emailjs
      .sendForm('service_8vd1u3e', 'template_n0toy5m', form.current, {
        publicKey: 'u8XCfo054j2oMFCu8',
      })
      .then(
        () => {
          console.log('Inquiry submitted successfully!');
          setIsSubmitted(true);
          setIsLoading(false);
          // Reset form
          form.current.reset();
        },
        (error) => {
          console.log('Failed to submit inquiry...', error.text);
          setIsLoading(false);
        }
      );
  };

  return (
    <section className="py-20 px-6    bg-gradient-to-b from-gray-800 to-gray-900 text-white">
      <div className="container mx-auto">
        <div className="flex flex-col lg:flex-row items-center justify-between">
          {/* Left side: Apartment Project Info */}
          <div className="lg:w-1/2  lg:mb-0 lg:pr-12">
            <span className="inline-block text-white text-sm uppercase tracking-wider mb-4 font-medium px-4 py-1 border border-white/20 rounded-full">
              Limited Time Offer
            </span>
            
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight mb-6">
              <span className="text-blue-500">Find Your</span> Perfect Home 
              <span className="block mt-2">With Exclusive Offers</span>
            </h2>
            
            <p className="text-white/80 text-lg mb-8 max-w-lg">
              Join our mailing list to receive the latest updates on available apartments, 
              special promotions, and exclusive discounts for Prime Residency.
            </p>
            
            <div className="flex flex-wrap gap-4 mb-6">
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-blue-600/20 flex items-center justify-center mr-3">
                  <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                </div>
                <span className="text-white/90">Premium Locations</span>
              </div>
              
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-blue-600/20 flex items-center justify-center mr-3">
                  <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                </div>
                <span className="text-white/90">Flexible Payment Plans</span>
              </div>
              
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-blue-600/20 flex items-center justify-center mr-3">
                  <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                </div>
                <span className="text-white/90">Special Move-in Offers</span>
              </div>
            </div>
          </div>

          {/* Right side: Inquiry Form */}
          <div className="lg:w-5/12 w-full">
            <div className="bg-white/10 backdrop-blur-md p-8 rounded-xl mt-16 border border-white/10 shadow-xl">
              <h3 className="text-2xl font-semibold mb-6 text-white">Request Information</h3>
              
              {isSubmitted ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-blue-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                  </div>
                  <h4 className="text-xl font-medium mb-2">Thank You!</h4>
                  <p className="text-white/70 mb-6">
                    We've received your inquiry and will contact you shortly with more information.
                  </p>
                  <button 
                    onClick={() => setIsSubmitted(false)}
                    className="text-blue-400 hover:text-blue-300 transition-colors"
                  >
                    Submit another inquiry
                  </button>
                </div>
              ) : (
                <form
                  ref={form}
                  className="space-y-4"
                  onSubmit={sendEmail}
                >
                  <div>
                    <label htmlFor="user_name" className="block text-sm font-medium text-white/80 mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      id="user_name"
                      name="user_name"
                      className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Your name"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="user_email" className="block text-sm font-medium text-white/80 mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="user_email"
                      name="user_email"
                      className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="your.email@example.com"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-white/80 mb-1">
                      Phone Number (Optional)
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Your phone number"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-white/80 mb-1">
                      Your Message (Optional)
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      rows="3"
                      className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Tell us about your requirements..."
                    ></textarea>
                  </div>
                  
                  <button
                    type="submit"
                    disabled={isLoading}
                    className={`w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg font-medium transition-colors duration-300 flex items-center justify-center ${
                      isLoading ? 'opacity-70 cursor-wait' : ''
                    }`}
                  >
                    {isLoading ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Processing...
                      </>
                    ) : (
                      'Submit Inquiry'
                    )}
                  </button>
                  
                  <p className="text-xs text-white/50 text-center mt-4">
                    By submitting this form, you agree to our privacy policy and terms of service.
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;