import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios'; // Import axios for HTTP requests

const VotersRegister = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    houseId: ''
  });
  const [photo, setPhoto] = useState(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [errors, setErrors] = useState({});
  
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  // Validation logic
  const validateForm = () => {
    const newErrors = {};
    const nameRegex = /^[a-zA-Z\s]+$/; // Name should only contain letters and spaces
    const houseIdRegex = /^H-\d+$/;  // House ID format: H-11, H-22, etc.
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/; // Comprehensive email validation

    if (!formData.name) newErrors.name = 'Full name is required.';
    else if (!nameRegex.test(formData.name)) newErrors.name = 'Name can only contain letters and spaces.';

    if (!formData.email) {
      newErrors.email = 'Email address is required.';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address.';
    }

    if (!formData.houseId) newErrors.houseId = 'House ID is required.';
    else if (!houseIdRegex.test(formData.houseId)) newErrors.houseId = 'House ID must be in the format H-11, H-12, etc.';
    
    if (!photo) newErrors.photo = 'Please capture a photo before submitting.';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
    
    // Clear error when user starts typing
    if (errors[id]) {
      setErrors(prev => ({ ...prev, [id]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage({ type: '', text: '' });

    if (!validateForm()) {
      setIsSubmitting(false);
      return;
    }

    try {
      // Create FormData object for submission
      const submitData = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        submitData.append(key, value);
      });
      
      if (photo) {
        submitData.append('photo', photo);
      }

      // Implement the actual POST request using axios
      // Replace this with the actual API endpoint
      const apiUrl = 'http://localhost:8001/api/voters/register';
      
      // Using axios for better handling of multipart/form-data
      const response = await axios.post(apiUrl, submitData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        // Add timeout to prevent indefinite waiting
        timeout: 10000,
      });
      
      // Axios automatically throws for non-2xx responses
      const result = response.data;
      
      setMessage({
        type: 'success',
        text: result.message || 'Registration successful! Your voter registration has been submitted.'
      });
      
      // Clear form after successful submission
      setFormData({ name: '', email: '', houseId: '' });
      setPhoto(null);
    } catch (error) {
      console.error('Error registering voter:', error);
      
      // Provide more specific error message if possible
      setMessage({
        type: 'error',
        text: error.message || 'Registration failed. Please check your internet connection and try again.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCapture = () => {
    if (!videoRef.current || !canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    
    // Ensure video dimensions are available
    if (videoRef.current.videoWidth === 0) {
      console.error("Video stream not ready yet");
      return;
    }
    
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);

    canvas.toBlob((blob) => {
      if (!blob) {
        console.error("Failed to capture image");
        return;
      }
      
      const file = new File([blob], 'captured_photo.png', { type: 'image/png' });
      setPhoto(file);
      setIsCapturing(false);
      stopWebcam();
      
      // Clear photo error if exists
      if (errors.photo) {
        setErrors(prev => ({ ...prev, photo: '' }));
      }
    }, 'image/png');
  };

  const toggleCamera = () => {
    setIsCapturing(!isCapturing);
    if (!isCapturing) {
      startWebcam();
    } else {
      stopWebcam();
    }
  };

  const startWebcam = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'user' } 
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => {
          videoRef.current.play().catch(err => {
            console.error("Error playing video:", err);
          });
        };
      }
    } catch (err) {
      console.error("Error accessing webcam:", err);
      setMessage({
        type: 'error',
        text: 'Unable to access camera. Please check your camera permissions.'
      });
      setIsCapturing(false);
    }
  };

  const stopWebcam = () => {
    if (!videoRef.current || !videoRef.current.srcObject) return;
    
    const stream = videoRef.current.srcObject;
    if (stream) {
      const tracks = stream.getTracks();
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
  };

  const retakePhoto = () => {
    setPhoto(null);
    setIsCapturing(true);
    startWebcam();
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => { 
      stopWebcam(); 
    };
  }, []);

  return (
    <div className="bg-gray-100 min-h-screen py-6">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-6 rounded-t-xl">
          <h2 className="text-3xl font-bold text-center">Voter Registration</h2>
          <p className="text-center text-blue-100 mt-2">Complete this form to register as a voter for the upcoming election</p>
        </div>
        
        {/* Status Messages */}
        {message.text && (
          <div className={`p-4 text-center ${message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'} border-l-4 ${message.type === 'success' ? 'border-green-500' : 'border-red-500'}`}>
            {message.text}
          </div>
        )}
        
        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column */}
            <div className="lg:col-span-2 space-y-4">
              <div className="flex items-center space-x-2 pb-2 border-b border-gray-200">
                <div className="bg-blue-100 rounded-full w-6 h-6 flex items-center justify-center text-blue-800 font-bold text-sm">1</div>
                <h3 className="text-lg font-semibold text-gray-800">Personal Information</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="name"
                    type="text"
                    value={formData.name}
                    onChange={handleInputChange}
                    className={`p-3 w-full border ${errors.name ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition`}
                    placeholder="Enter your full name"
                    autoComplete="name"
                  />
                  {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={`p-3 w-full border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition`}
                    placeholder="you@example.com"
                    autoComplete="email"
                  />
                  {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
                </div>
              </div>
              
              <div>
                <label htmlFor="houseId" className="block text-sm font-medium text-gray-700 mb-1">
                  House ID <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    id="houseId"
                    type="text"
                    value={formData.houseId}
                    onChange={handleInputChange}
                    className={`p-3 w-full border ${errors.houseId ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition`}
                    placeholder="H-123"
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <span className="text-gray-400 text-xs">Format: H-123</span>
                  </div>
                </div>
                {errors.houseId && <p className="mt-1 text-sm text-red-600">{errors.houseId}</p>}
                <p className="mt-1 text-sm text-gray-500 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  Your House ID can be found on your utility bill or resident card
                </p>
              </div>
            </div>

            {/* Right Column: Photo Capture */}
            <div className="border rounded-lg p-4 bg-gray-50 shadow-inner">
              <div className="flex items-center space-x-2 pb-2 border-b border-gray-200 mb-4">
                <div className="bg-blue-100 rounded-full w-6 h-6 flex items-center justify-center text-blue-800 font-bold text-sm">2</div>
                <h3 className="text-lg font-semibold text-gray-800">Photo Identification</h3>
              </div>
              
              {photo ? (
                <div className="space-y-4">
                  <div className="flex justify-center">
                    <div className="relative">
                      <img
                        src={URL.createObjectURL(photo)}
                        alt="Voter Photo"
                        className="h-48 w-48 object-cover rounded-lg shadow-md border-2 border-white"
                      />
                      <div className="absolute -top-2 -right-2">
                        <span className="bg-green-500 text-white p-1 rounded-full shadow-md">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-center">
                    <button
                      type="button"
                      onClick={retakePhoto}
                      className="inline-flex items-center text-sm bg-white text-gray-700 border border-gray-300 py-2 px-4 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                      Retake Photo
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  {isCapturing ? (
                    <div className="space-y-3">
                      <div className="relative rounded-lg overflow-hidden border border-gray-300 shadow-inner">
                        <video
                          ref={videoRef}
                          className="w-full h-auto aspect-video"
                          autoPlay
                          muted
                          playsInline
                        ></video>
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                          <div className="border-2 border-white rounded-full w-32 h-32 opacity-75"></div>
                        </div>
                      </div>
                      <canvas ref={canvasRef} style={{ display: 'none' }}></canvas>
                      <div className="flex space-x-2">
                        <button
                          type="button"
                          onClick={handleCapture}
                          className="flex-1 bg-green-600 text-white py-2 px-3 rounded-lg text-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors flex items-center justify-center"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M4 5a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2h-1.586a1 1 0 01-.707-.293l-1.121-1.121A2 2 0 0011.172 3H8.828a2 2 0 00-1.414.586L6.293 4.707A1 1 0 015.586 5H4zm6 9a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                          </svg>
                          Capture
                        </button>
                        <button
                          type="button"
                          onClick={toggleCamera}
                          className="flex-1 bg-gray-600 text-white py-2 px-3 rounded-lg text-sm hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors flex items-center justify-center"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-6 bg-white rounded-lg border-2 border-dashed border-gray-300">
                      <div className="mx-auto h-16 w-16 rounded-full bg-blue-100 flex items-center justify-center mb-3">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      </div>
                      <p className="text-gray-600 mb-3">Take a photo for voter verification</p>
                      <button
                        type="button"
                        onClick={toggleCamera}
                        className="inline-flex items-center justify-center px-4 py-2 text-sm rounded-lg shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M4 5a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2h-1.586a1 1 0 01-.707-.293l-1.121-1.121A2 2 0 0011.172 3H8.828a2 2 0 00-1.414.586L6.293 4.707A1 1 0 015.586 5H4zm6 9a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                        </svg>
                        Open Camera
                      </button>
                      {errors.photo && (
                        <p className="mt-2 text-sm text-red-600">
                          {errors.photo}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Submit Button Section */}
          <div className="mt-8 border-t border-gray-200 pt-6">
            <div className="flex flex-col items-center">
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full md:w-1/2 py-3 px-6 rounded-lg shadow-md text-base font-medium transition-all ${isSubmitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 text-white hover:shadow-lg'}`}
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </div>
                ) : (
                  <div className="flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Complete Registration
                  </div>
                )}
              </button>
              
              {/* Privacy Note */}
              <div className="mt-4 text-center text-sm text-gray-500 max-w-md">
                <p>
                  By registering, you agree to our Privacy Policy. Your information will be used only for voter verification purposes.
                </p>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default VotersRegister;