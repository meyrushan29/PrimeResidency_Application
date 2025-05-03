import React, { useRef, useState } from 'react';
import emailjs from '@emailjs/browser';
import { CheckCircle2, Mail, Phone, MapPin, Clock, ArrowRight, Check } from 'lucide-react';

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
    <section className="py-28 px-4 bg-gradient-to-b from-gray-50 to-gray-100 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 z-0 opacity-10">
        <div className="absolute top-1/4 left-1/5 w-96 h-96 rounded-full bg-gradient-to-r from-blue-400 to-indigo-400 blur-3xl"></div>
        <div className="absolute bottom-1/3 right-1/5 w-80 h-80 rounded-full bg-gradient-to-r from-cyan-400 to-teal-400 blur-3xl"></div>
      </div>
      
      <div className="container mx-auto max-w-7xl relative z-10">
        <div className="text-center mb-16">
          <div className="inline-block mb-4">
            <span className="inline-block px-5 py-2 rounded-full bg-blue-100 border border-blue-200 text-sm text-blue-700 font-medium tracking-wide">
              <span className="inline-block mr-2 w-2 h-2 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 animate-pulse"></span>
              GET IN TOUCH
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-700 mb-5">
            Contact Us Today
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            We're here to help you find your perfect home. Reach out to our team for personalized assistance.
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-stretch">
          {/* Left side: Information */}
          <div className="lg:col-span-5 flex flex-col justify-between">
            <div>
              <div className="inline-block mb-6">
                <span className="inline-block px-5 py-2 rounded-full bg-blue-100 border border-blue-200 text-sm text-blue-700 font-medium">
                  Limited Time Offer
                </span>
              </div>
              
              <h3 className="text-3xl font-bold mb-6">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-700">Find Your</span> Perfect Home 
                <span className="block mt-2">With Exclusive Offers</span>
              </h3>
              
              <p className="text-gray-600 mb-8 leading-relaxed">
                Join our mailing list to receive the latest updates on available apartments, 
                special promotions, and exclusive discounts for Prime Residency.
              </p>
              
              <div className="space-y-4 mb-10">
                <div className="flex items-start">
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                    <Check size={18} className="text-blue-600" />
                  </div>
                  <div>
                    <span className="text-gray-700 font-medium">Premium Locations</span>
                    <p className="text-gray-500 text-sm mt-1">Centrally situated in the most sought-after neighborhoods</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                    <Check size={18} className="text-blue-600" />
                  </div>
                  <div>
                    <span className="text-gray-700 font-medium">Flexible Payment Plans</span>
                    <p className="text-gray-500 text-sm mt-1">Multiple options to suit your financial preferences</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                    <Check size={18} className="text-blue-600" />
                  </div>
                  <div>
                    <span className="text-gray-700 font-medium">Special Move-in Offers</span>
                    <p className="text-gray-500 text-sm mt-1">Exclusive incentives for new residents</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Contact Information */}
            <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100 mt-6">
              <h4 className="text-xl font-bold mb-6 text-gray-800">Contact Information</h4>
              <div className="space-y-5">
                <div className="flex items-start">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-4 flex-shrink-0">
                    <Phone size={18} className="text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Phone</p>
                    <a href="tel:+94776789098" className="text-blue-600 font-medium hover:text-blue-700 transition-colors">
                      +94 77 678 9098
                    </a>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-4 flex-shrink-0">
                    <Mail size={18} className="text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Email</p>
                    <a href="mailto:info@primeresidency.lk" className="text-blue-600 font-medium hover:text-blue-700 transition-colors">
                      info@primeresidency.lk
                    </a>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-4 flex-shrink-0">
                    <MapPin size={18} className="text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Address</p>
                    <p className="text-gray-700">
                      123 PrimeResidency Ave, Colombo, Sri Lanka
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-4 flex-shrink-0">
                    <Clock size={18} className="text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Office Hours</p>
                    <p className="text-gray-700">
                      Monday to Friday: 9:00 AM - 6:00 PM<br />
                      Saturday: 10:00 AM - 4:00 PM
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right side: Form */}
          <div className="lg:col-span-7">
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
              <div className="p-8 md:p-10">
                <h3 className="text-2xl font-bold mb-6 text-gray-800">Request Information</h3>
                
                {isSubmitted ? (
                  <div className="py-12 text-center">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                      <CheckCircle2 size={32} className="text-blue-600" />
                    </div>
                    <h4 className="text-2xl font-bold mb-4 text-gray-800">Thank You!</h4>
                    <p className="text-gray-600 mb-8 max-w-md mx-auto">
                      We've received your inquiry and will contact you shortly with more information about our available properties.
                    </p>
                    <button 
                      onClick={() => setIsSubmitted(false)}
                      className="px-6 py-3 rounded-lg border border-blue-600 text-blue-600 hover:bg-blue-50 transition-colors duration-300 font-medium"
                    >
                      Submit another inquiry
                    </button>
                  </div>
                ) : (
                  <form
                    ref={form}
                    className="space-y-6"
                    onSubmit={sendEmail}
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="user_name" className="block text-sm font-medium text-gray-700 mb-1">
                          Full Name <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          id="user_name"
                          name="user_name"
                          className="w-full bg-white border border-gray-300 rounded-lg p-3 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Your name"
                          required
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="user_email" className="block text-sm font-medium text-gray-700 mb-1">
                          Email Address <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="email"
                          id="user_email"
                          name="user_email"
                          className="w-full bg-white border border-gray-300 rounded-lg p-3 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="your.email@example.com"
                          required
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                        Phone Number (Optional)
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        className="w-full bg-white border border-gray-300 rounded-lg p-3 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Your phone number"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                        Your Message (Optional)
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        rows="4"
                        className="w-full bg-white border border-gray-300 rounded-lg p-3 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Tell us about your requirements or any questions you might have..."
                      ></textarea>
                    </div>
                    
                    <div className="flex items-start">
                      <input
                        id="privacy"
                        name="privacy"
                        type="checkbox"
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mt-1"
                        required
                      />
                      <label htmlFor="privacy" className="ml-2 block text-sm text-gray-600">
                        I agree to the <a href="#privacy" className="text-blue-600 hover:underline">Privacy Policy</a> and <a href="#terms" className="text-blue-600 hover:underline">Terms of Service</a>
                      </label>
                    </div>
                    
                    <button
                      type="submit"
                      disabled={isLoading}
                      className={`w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-4 px-6 rounded-lg font-medium transition-all duration-300 flex items-center justify-center ${
                        isLoading ? 'opacity-70 cursor-wait' : ''
                      } shadow-md hover:shadow-lg`}
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
                        <>
                          Submit Inquiry
                          <ArrowRight size={18} className="ml-2" />
                        </>
                      )}
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;