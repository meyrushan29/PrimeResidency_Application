import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Voting = () => {
  const [polls, setPolls] = useState([]);
  const [selectedOptions, setSelectedOptions] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedPoll, setExpandedPoll] = useState(null);
  const [submitting, setSubmitting] = useState({});
  
  // Verification states
  const [verificationStep, setVerificationStep] = useState(null);
  const [currentPollId, setCurrentPollId] = useState(null);
  const [otpValue, setOtpValue] = useState('');
  const [email, setEmail] = useState('');
  const [verificationMethod, setVerificationMethod] = useState('otp'); // 'otp', 'email', or 'face'
  const [otpSent, setOtpSent] = useState(false);
  const [verificationError, setVerificationError] = useState(null);
  const [timer, setTimer] = useState(0);
  const [webcamActive, setWebcamActive] = useState(false);
  const [faceDetected, setFaceDetected] = useState(false);

  useEffect(() => {
    const fetchPolls = async () => {
      setIsLoading(true);
      try {
        const { data } = await axios.get('http://localhost:8001/api/polls');
        setPolls(data);
        setError(null);
      } catch {
        setError('Failed to load polls. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchPolls();
  }, []);

  // Effect for OTP countdown timer
  useEffect(() => {
    let interval;
    if (otpSent && timer > 0) {
      interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
    } else if (timer === 0 && otpSent) {
      setOtpSent(false);
    }
    return () => clearInterval(interval);
  }, [otpSent, timer]);

  const handleOptionSelect = (pollId, optionId) => {
    setSelectedOptions({
      ...selectedOptions,
      [pollId]: optionId,
    });
  };

  // Initialize verification process
  const initiateVote = (pollId) => {
    if (!selectedOptions[pollId]) {
      showNotification('error', 'Please select an option first');
      return;
    }
    
    setCurrentPollId(pollId);
    setVerificationStep('method');
    setVerificationError(null);
    setOtpValue('');
    setEmail('');
  };

  // Choose verification method
  const selectVerificationMethod = (method) => {
    setVerificationMethod(method);
    
    if (method === 'otp') {
      setVerificationStep('phone');
    } else if (method === 'email') {
      setVerificationStep('email');
    } else if (method === 'face') {
      setVerificationStep('face');
      setTimeout(() => {
        // Simulate face detection process
        setWebcamActive(true);
      }, 500);
    }
  };

  // Send OTP
  const sendOTP = async () => {
    setSubmitting({ ...submitting, otp: true });
    
    try {
      // Mock API call to send OTP
      // In real implementation, replace with actual API call
      // await axios.post('http://localhost:8001/api/auth/send-otp', { phone });
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setOtpSent(true);
      setTimer(120); // 2 minutes countdown
      setVerificationStep('verify-otp');
      setVerificationError(null);
      showNotification('success', 'OTP sent successfully');
    } catch (error) {
      setVerificationError('Failed to send OTP. Please try again.');
    } finally {
      setSubmitting({ ...submitting, otp: false });
    }
  };

  // Send verification email
  const sendVerificationEmail = async () => {
    if (!validateEmail(email)) {
      setVerificationError('Please enter a valid email address');
      return;
    }
    
    setSubmitting({ ...submitting, email: true });
    
    try {
      // Mock API call to send verification email
      // In real implementation, replace with actual API call
      // await axios.post('http://localhost:8001/api/auth/send-email', { email });
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setVerificationStep('verify-email');
      setVerificationError(null);
      showNotification('success', 'Verification email sent');
    } catch (error) {
      setVerificationError('Failed to send verification email. Please try again.');
    } finally {
      setSubmitting({ ...submitting, email: false });
    }
  };

  // Face recognition
  const handleFaceRecognition = async () => {
    setSubmitting({ ...submitting, face: true });
    
    try {
      // Simulate face recognition process
      await new Promise(resolve => setTimeout(resolve, 2000));
      setFaceDetected(true);
      
      // Simulate verification
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // After successful face recognition, proceed with vote
      await handleVoteSubmission();
      
      // Reset face recognition states
      setWebcamActive(false);
      setFaceDetected(false);
    } catch (error) {
      setVerificationError('Face recognition failed. Please try again.');
    } finally {
      setSubmitting({ ...submitting, face: false });
    }
  };

  // Verify OTP input
  const verifyOTP = async () => {
    if (otpValue.length !== 6) {
      setVerificationError('Please enter a valid 6-digit OTP');
      return;
    }
    
    setSubmitting({ ...submitting, verifyOtp: true });
    
    try {
      // Mock API call to verify OTP
      // In real implementation, replace with actual API call
      // await axios.post('http://localhost:8001/api/auth/verify-otp', { otp: otpValue });
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // After successful OTP verification, proceed with vote
      await handleVoteSubmission();
    } catch (error) {
      setVerificationError('Invalid OTP. Please try again.');
    } finally {
      setSubmitting({ ...submitting, verifyOtp: false });
    }
  };

  // Verify email verification code
  const verifyEmail = async () => {
    if (otpValue.length !== 6) {
      setVerificationError('Please enter a valid 6-digit verification code');
      return;
    }
    
    setSubmitting({ ...submitting, verifyEmail: true });
    
    try {
      // Mock API call to verify email code
      // In real implementation, replace with actual API call
      // await axios.post('http://localhost:8001/api/auth/verify-email', { code: otpValue, email });
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // After successful email verification, proceed with vote
      await handleVoteSubmission();
    } catch (error) {
      setVerificationError('Invalid verification code. Please try again.');
    } finally {
      setSubmitting({ ...submitting, verifyEmail: false });
    }
  };

  // Submit vote after verification
  const handleVoteSubmission = async () => {
    const pollId = currentPollId;
    
    try {
      const response = await axios.post(
        'http://localhost:8001/api/polls/vote',
        {
          pollId,
          optionId: selectedOptions[pollId],
        }
      );

      const updatedPolls = polls.map((poll) => {
        if (poll._id === pollId) {
          return { ...poll, hasVoted: true };
        }
        return poll;
      });

      setPolls(updatedPolls);
      showNotification('success', response.data?.message || 'Vote cast successfully');
      
      // Reset verification states
      setVerificationStep(null);
      setCurrentPollId(null);
      setOtpValue('');
      setEmail('');
      setOtpSent(false);
      setWebcamActive(false);
      setFaceDetected(false);
    } catch (error) {
      showNotification('error', error.response?.data?.message || error.message || 'Failed to cast vote');
    }
  };

  // Cancel verification process
  const cancelVerification = () => {
    setVerificationStep(null);
    setCurrentPollId(null);
    setOtpValue('');
    setEmail('');
    setOtpSent(false);
    setWebcamActive(false);
    setFaceDetected(false);
    setVerificationError(null);
  };

  const showNotification = (type, message) => {
    // In a real app, use a toast notification library
    // For now we'll use alert just so it's functional
    if (type === 'error') {
      alert(`⚠️ ${message}`);
    } else {
      alert(`✅ ${message}`);
    }
  };

  const togglePollExpansion = (pollId) => {
    setExpandedPoll(expandedPoll === pollId ? null : pollId);
  };

  // Email validation
  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  // Render verification modal based on current step
  const renderVerificationModal = () => {
    if (!verificationStep) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden">
          <div className="bg-blue-600 text-white px-6 py-4 flex justify-between items-center">
            <h3 className="text-lg font-semibold">Verify Your Identity</h3>
            <button 
              onClick={cancelVerification}
              className="text-white hover:text-blue-100 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <div className="p-6">
            {verificationStep === 'method' && (
              <div>
                <h4 className="text-lg font-medium text-gray-900 mb-4">Choose Verification Method</h4>
                <p className="text-gray-600 mb-6">Please select how you would like to verify your identity before casting your vote</p>
                
                <div className="space-y-3">
                  <button
                    onClick={() => selectVerificationMethod('otp')}
                    className="w-full flex items-center p-4 bg-gray-50 hover:bg-blue-50 border-2 border-gray-200 hover:border-blue-300 rounded-lg transition-colors"
                  >
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-4">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                      </svg>
                    </div>
                    <div className="text-left">
                      <h5 className="font-medium text-gray-900">Phone OTP</h5>
                      <p className="text-sm text-gray-500">Verify using one-time password sent to your phone</p>
                    </div>
                  </button>
                  
                  <button
                    onClick={() => selectVerificationMethod('email')}
                    className="w-full flex items-center p-4 bg-gray-50 hover:bg-blue-50 border-2 border-gray-200 hover:border-blue-300 rounded-lg transition-colors"
                  >
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-4">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                        <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                      </svg>
                    </div>
                    <div className="text-left">
                      <h5 className="font-medium text-gray-900">Email Verification</h5>
                      <p className="text-sm text-gray-500">Verify using a code sent to your email address</p>
                    </div>
                  </button>
                  
                  <button
                    onClick={() => selectVerificationMethod('face')}
                    className="w-full flex items-center p-4 bg-gray-50 hover:bg-blue-50 border-2 border-gray-200 hover:border-blue-300 rounded-lg transition-colors"
                  >
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-4">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="text-left">
                      <h5 className="font-medium text-gray-900">Face Recognition</h5>
                      <p className="text-sm text-gray-500">Verify your identity using your face</p>
                    </div>
                  </button>
                </div>
              </div>
            )}
            
            {verificationStep === 'phone' && (
              <div>
                <h4 className="text-lg font-medium text-gray-900 mb-4">Phone Verification</h4>
                <p className="text-gray-600 mb-4">Enter your phone number to receive a verification code</p>
                
                <div className="mb-4">
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                  <input
                    type="tel"
                    id="phone"
                    placeholder="Enter your phone number"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                {verificationError && (
                  <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-md text-sm">
                    {verificationError}
                  </div>
                )}
                
                <div className="flex justify-between">
                  <button
                    onClick={cancelVerification}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={sendOTP}
                    disabled={submitting.otp}
                    className={`px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors ${
                      submitting.otp ? 'opacity-70 cursor-not-allowed' : ''
                    }`}
                  >
                    {submitting.otp ? (
                      <span className="flex items-center">
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Sending...
                      </span>
                    ) : 'Send OTP'}
                  </button>
                </div>
              </div>
            )}
            
            {verificationStep === 'verify-otp' && (
              <div>
                <h4 className="text-lg font-medium text-gray-900 mb-4">Enter Verification Code</h4>
                <p className="text-gray-600 mb-4">Enter the 6-digit code sent to your phone</p>
                
                <div className="mb-4">
                  <label htmlFor="otp" className="block text-sm font-medium text-gray-700 mb-1">OTP Code</label>
                  <input
                    type="text"
                    id="otp"
                    placeholder="Enter 6-digit code"
                    maxLength={6}
                    value={otpValue}
                    onChange={(e) => setOtpValue(e.target.value.replace(/[^0-9]/g, ''))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-center text-lg letter-spacing-2 font-mono"
                  />
                </div>
                
                {timer > 0 && (
                  <p className="text-sm text-gray-500 mb-4">
                    Resend OTP in {Math.floor(timer / 60)}:{(timer % 60).toString().padStart(2, '0')}
                  </p>
                )}
                
                {verificationError && (
                  <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-md text-sm">
                    {verificationError}
                  </div>
                )}
                
                <div className="flex justify-between">
                  <button
                    onClick={cancelVerification}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={verifyOTP}
                    disabled={submitting.verifyOtp || otpValue.length !== 6}
                    className={`px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors ${
                      submitting.verifyOtp || otpValue.length !== 6 ? 'opacity-70 cursor-not-allowed' : ''
                    }`}
                  >
                    {submitting.verifyOtp ? (
                      <span className="flex items-center">
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Verifying...
                      </span>
                    ) : 'Verify Code'}
                  </button>
                </div>
              </div>
            )}
            
            {verificationStep === 'email' && (
              <div>
                <h4 className="text-lg font-medium text-gray-900 mb-4">Email Verification</h4>
                <p className="text-gray-600 mb-4">Enter your email address to receive a verification link</p>
                
                <div className="mb-4">
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                  <input
                    type="email"
                    id="email"
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                {verificationError && (
                  <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-md text-sm">
                    {verificationError}
                  </div>
                )}
                
                <div className="flex justify-between">
                  <button
                    onClick={cancelVerification}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={sendVerificationEmail}
                    disabled={submitting.email || !email}
                    className={`px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors ${
                      submitting.email || !email ? 'opacity-70 cursor-not-allowed' : ''
                    }`}
                  >
                    {submitting.email ? (
                      <span className="flex items-center">
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Sending...
                      </span>
                    ) : 'Send Verification Email'}
                  </button>
                </div>
              </div>
            )}
            
            {verificationStep === 'verify-email' && (
              <div>
                <h4 className="text-lg font-medium text-gray-900 mb-4">Email Verification Code</h4>
                <p className="text-gray-600 mb-4">Enter the 6-digit code sent to your email address</p>
                
                <div className="mb-4">
                  <label htmlFor="emailOtp" className="block text-sm font-medium text-gray-700 mb-1">Verification Code</label>
                  <input
                    type="text"
                    id="emailOtp"
                    placeholder="Enter 6-digit code"
                    maxLength={6}
                    value={otpValue}
                    onChange={(e) => setOtpValue(e.target.value.replace(/[^0-9]/g, ''))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-center text-lg letter-spacing-2 font-mono"
                  />
                </div>
                
                {verificationError && (
                  <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-md text-sm">
                    {verificationError}
                  </div>
                )}
                
                <div className="flex justify-between">
                  <button
                    onClick={cancelVerification}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={verifyEmail}
                    disabled={submitting.verifyEmail || otpValue.length !== 6}
                    className={`px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors ${
                      submitting.verifyEmail || otpValue.length !== 6 ? 'opacity-70 cursor-not-allowed' : ''
                    }`}
                  >
                    {submitting.verifyEmail ? (
                      <span className="flex items-center">
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Verifying...
                      </span>
                    ) : 'Verify Code'}
                  </button>
                </div>
              </div>
            )}
            
            {verificationStep === 'face' && (
              <div>
                <h4 className="text-lg font-medium text-gray-900 mb-4">Face Recognition</h4>
                <p className="text-gray-600 mb-4">Position your face in front of the camera for verification</p>
                
                <div className="mb-6">
                  <div className="w-full h-64 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden relative">
                    {webcamActive ? (
                      <>
                        {/* This would be replaced with an actual webcam component in production */}
                        <div className="absolute inset-0 bg-gray-800 opacity-20"></div>
                        <div className={`absolute inset-0 border-4 rounded-lg transition-colors ${faceDetected ? 'border-green-500' : 'border-yellow-500'}`}></div>
                        
                        {faceDetected && (
                          <div className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-medium">
                            Face Detected
                          </div>
                        )}
                        
                        {/* Placeholder for webcam */}
                        <div className="flex items-center justify-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                      </>
                    ) : (
                      <div className="flex flex-col items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-400 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <p className="text-gray-500 text-sm">Camera initializing...</p>
                      </div>
                    )}
                  </div>
                </div>
                
                {verificationError && (
                  <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-md text-sm">
                    {verificationError}
                  </div>
                )}
                
                <div className="flex justify-between">
                  <button
                    onClick={cancelVerification}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleFaceRecognition}
                    disabled={submitting.face || !webcamActive}
                    className={`px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors ${
                      submitting.face || !webcamActive ? 'opacity-70 cursor-not-allowed' : ''
                    }`}
                  >
                    {submitting.face ? (
                      <span className="flex items-center">
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Verifying...
                      </span>
                    ) : 'Verify Identity'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg mt-8">
        <div className="animate-pulse space-y-8">
          <div className="h-10 w-1/2 bg-gray-200 rounded mb-6"></div>
          {[1, 2, 3].map((index) => (
            <div key={index} className="border border-gray-100 rounded-lg p-4">
              <div className="h-6 w-3/4 bg-gray-200 rounded mb-4"></div>
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-12 bg-gray-100 rounded"></div>
                ))}
              </div>
              <div className="h-12 w-full bg-gray-200 rounded mt-4"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg mt-8">
        <div className="text-center p-6 bg-red-50 rounded-lg border border-red-100">
          <div className="mb-4 inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-red-700 mb-2">Unable to Load Polls</h2>
          <p className="text-red-600 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (polls.length === 0) {
    return (
      <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg mt-8">
        <div className="text-center p-8">
          <div className="mb-4 inline-flex items-center justify-center w-20 h-20 rounded-full bg-blue-50">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-3">No Active Polls</h2>
          <p className="text-gray-600 max-w-md mx-auto mb-6">There are currently no polls available for voting. Check back later for new polls.</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 mx-auto"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
            </svg>
            Refresh
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg mt-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Active Polls</h1>
        <p className="text-gray-600">Select an option and submit your vote for each poll</p>
      </header>

      <div className="space-y-6">
        {polls.map((poll) => (
          <div 
            key={poll._id} 
            className={`border rounded-lg overflow-hidden transition-all duration-300 ${
              poll.hasVoted ? 'border-green-200 bg-green-50' : 'border-gray-200 hover:border-blue-200'
            } ${expandedPoll === poll._id ? 'shadow-md' : 'shadow-sm'}`}
          >
            <div 
              onClick={() => togglePollExpansion(poll._id)}
              className={`p-4 flex justify-between items-center cursor-pointer ${
                poll.hasVoted ? 'bg-green-50' : 'bg-gradient-to-r from-blue-50 to-indigo-50'
              }`}
            >
              <div className="flex items-center gap-3">
                {poll.hasVoted && (
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
                <h2 className="text-lg font-semibold text-gray-800">{poll.question}</h2>
              </div>
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className={`h-5 w-5 text-gray-500 transition-transform ${expandedPoll === poll._id ? 'transform rotate-180' : ''}`}
                viewBox="0 0 20 20" 
                fill="currentColor"
              >
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </div>

            <div className={`transition-all duration-300 overflow-hidden ${expandedPoll === poll._id ? 'max-h-96' : 'max-h-0'}`}>
              <div className="p-5 border-t border-gray-200">
                <div className="space-y-3 mb-6">
                  {poll.options.map((option) => (
                    <label
                      key={option._id}
                      className={`flex items-center p-4 rounded-lg cursor-pointer transition-all duration-200
                        ${poll.hasVoted && selectedOptions[poll._id] === option._id
                          ? 'bg-green-100 border-2 border-green-500'
                          : selectedOptions[poll._id] === option._id
                            ? 'bg-blue-50 border-2 border-blue-500'
                            : 'bg-gray-50 hover:bg-gray-100 border-2 border-transparent'
                        } ${poll.hasVoted ? 'cursor-default' : 'cursor-pointer'}`}
                    >
                      <div className="relative">
                        <input
                          type="radio"
                          id={option._id}
                          name={poll._id}
                          value={option._id}
                          checked={selectedOptions[poll._id] === option._id}
                          onChange={() => !poll.hasVoted && handleOptionSelect(poll._id, option._id)}
                          disabled={poll.hasVoted}
                          className="h-5 w-5 text-blue-600 focus:ring-blue-500"
                        />
                        {poll.hasVoted && selectedOptions[poll._id] === option._id && (
                          <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-white" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          </div>
                        )}
                      </div>
                      <span className={`ml-3 font-medium ${
                        poll.hasVoted && selectedOptions[poll._id] === option._id
                          ? 'text-green-700'
                          : 'text-gray-700'
                      }`}>{option.option}</span>
                    </label>
                  ))}
                </div>
                <button
                  onClick={() => initiateVote(poll._id)}
                  disabled={poll.hasVoted || !selectedOptions[poll._id]}
                  className={`w-full py-3 px-4 flex justify-center items-center gap-2 rounded-lg font-medium transition-all duration-200
                    ${poll.hasVoted
                      ? 'bg-green-100 text-green-700 cursor-default'
                      : selectedOptions[poll._id]
                        ? 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
                        : 'bg-gray-200 text-gray-500 cursor-not-allowed'}`}
                >
                  {poll.hasVoted ? (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span>Vote Recorded</span>
                    </>
                  ) : (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 1.414L10.586 9H7a1 1 0 100 2h3.586l-1.293 1.293a1 1 0 101.414 1.414l3-3a1 1 0 000-1.414z" clipRule="evenodd" />
                      </svg>
                      <span>Submit Vote</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Quick status for collapsed polls */}
            {expandedPoll !== poll._id && (
              <div className="px-4 py-2 text-sm border-t border-gray-200">
                <span className={poll.hasVoted ? 'text-green-600' : selectedOptions[poll._id] ? 'text-blue-600' : 'text-gray-500'}>
                  {poll.hasVoted ? 'Voted' : selectedOptions[poll._id] ? 'Option selected - Ready to vote' : 'No option selected'}
                </span>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Verification Modal */}
      {renderVerificationModal()}
    </div>
  );
};

export default Voting;