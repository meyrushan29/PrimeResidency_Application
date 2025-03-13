import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

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
  const videoRef = useRef();
  const canvasRef = useRef();

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage({ type: '', text: '' });

    const submitData = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      submitData.append(key, value);
    });
    
    if (photo) {
      submitData.append('photo', photo);
    }

    try {
      await axios.post('http://localhost:8000/api/voters/register', submitData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setMessage({
        type: 'success',
        text: 'Registration successful!'
      });
      
      setFormData({ name: '', email: '', houseId: '' });
      setPhoto(null);
    } catch (error) {
      console.error('Error registering voter:', error);
      setMessage({ 
        type: 'error', 
        text: 'Registration failed. Please try again.' 
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCapture = () => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);

    canvas.toBlob((blob) => {
      const file = new File([blob], 'captured_photo.png', { type: 'image/png' });
      setPhoto(file);
      setIsCapturing(false);
      stopWebcam();
    });
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
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      videoRef.current.srcObject = stream;
    } catch (err) {
      console.error("Error accessing webcam:", err);
      setMessage({
        type: 'error',
        text: 'Unable to access camera.'
      });
    }
  };

  const stopWebcam = () => {
    const stream = videoRef.current?.srcObject;
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
  };

  const retakePhoto = () => {
    setPhoto(null);
    setIsCapturing(true);
    startWebcam();
  };

  useEffect(() => {
    return () => { stopWebcam(); };
  }, []);

  return (
    <div className="bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
        {/* Header - more compact */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 rounded-t-xl">
          <h2 className="text-2xl font-bold text-center">Voter Registration</h2>
          <p className="text-sm text-center text-blue-100">Complete this form to register as a voter.</p>
        </div>
        
        {/* Status Messages */}
        {message.text && (
          <div className={`p-2 text-sm ${message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'} border-l-4 ${message.type === 'success' ? 'border-green-500' : 'border-red-500'}`}>
            {message.text}
          </div>
        )}
        
        {/* Form - Restructured to be more compact */}
        <form onSubmit={handleSubmit} className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Left Column: Personal Info */}
            <div className="md:col-span-2 space-y-3">
              <h3 className="text-lg font-semibold text-gray-800">Personal Information</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="name"
                    type="text"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="mt-1 p-2 w-full border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter your full name"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="mt-1 p-2 w-full border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                    placeholder="you@example.com"
                    required
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="houseId" className="block text-sm font-medium text-gray-700">
                  House ID <span className="text-red-500">*</span>
                </label>
                <input
                  id="houseId"
                  type="text"
                  value={formData.houseId}
                  onChange={handleInputChange}
                  className="mt-1 p-2 w-full border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter your House ID"
                  required
                />
                <p className="mt-1 text-xs text-gray-500">
                  Your House ID can be found on your utility bill
                </p>
              </div>
              
              {/* Submit Button moved up into form section */}
              <div className="mt-4">
                <button
                  type="submit"
                  disabled={isSubmitting || !photo}
                  className={`w-full py-2 px-4 rounded shadow-sm flex items-center justify-center text-sm font-medium 
                    ${isSubmitting || !photo ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 text-white'}`}
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </>
                  ) : (
                    'Complete Registration'
                  )}
                </button>
                {!photo && (
                  <p className="mt-1 text-center text-xs text-red-600">
                    Please capture your photo before submitting
                  </p>
                )}
              </div>
              
              {/* Privacy Note - more compact */}
              <div className="text-center text-xs text-gray-500">
                By registering, you agree to our Privacy Policy. Your information will be used only for voter verification.
              </div>
            </div>
            
            {/* Right Column: Photo Capture */}
            <div className="border rounded-lg p-3 bg-gray-50">
              <h3 className="text-sm font-semibold text-gray-800 mb-2">Photo Identification</h3>
              
              {photo ? (
                <div className="space-y-2">
                  <div className="flex justify-center">
                    <div className="relative">
                      <img 
                        src={URL.createObjectURL(photo)} 
                        alt="Voter Photo" 
                        className="h-36 object-cover rounded-lg shadow-sm" 
                      />
                      <div className="absolute top-0 right-0 -mt-1 -mr-1">
                        <span className="bg-green-500 text-white text-xs px-1 py-0.5 rounded-full text-xs shadow-sm">
                          ✓
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-center">
                    <button
                      type="button"
                      onClick={retakePhoto}
                      className="text-xs bg-white text-gray-700 border border-gray-300 py-1 px-2 rounded hover:bg-gray-50"
                    >
                      Retake Photo
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  {isCapturing ? (
                    <div className="space-y-2">
                      <div className="relative">
                        <video
                          ref={videoRef}
                          className="w-full h-auto rounded-lg shadow-sm border border-gray-200"
                          autoPlay
                          muted
                          playsInline
                        ></video>
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                          <div className="border-2 border-white rounded-full w-24 h-24 opacity-75"></div>
                        </div>
                      </div>
                      <canvas ref={canvasRef} style={{ display: 'none' }}></canvas>
                      <div className="flex space-x-2">
                        <button
                          type="button"
                          onClick={handleCapture}
                          className="flex-1 bg-green-600 text-white py-1 px-2 rounded text-xs hover:bg-green-700"
                        >
                          Capture
                        </button>
                        <button
                          type="button"
                          onClick={toggleCamera}
                          className="flex-1 bg-gray-600 text-white py-1 px-2 rounded text-xs hover:bg-gray-700"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-4">
                      <div className="mx-auto h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center mb-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      </div>
                      <p className="text-xs text-gray-600 mb-2">No photo yet</p>
                      <button
                        type="button"
                        onClick={toggleCamera}
                        className="inline-flex items-center px-2 py-1 text-xs rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M4 5a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2h-1.586a1 1 0 01-.707-.293l-1.121-1.121A2 2 0 0011.172 3H8.828a2 2 0 00-1.414.586L6.293 4.707A1 1 0 015.586 5H4zm6 9a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                        </svg>
                        Use Camera
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default VotersRegister;