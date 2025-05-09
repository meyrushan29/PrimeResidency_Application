import React, { useState, useEffect, useRef } from 'react';
import SignatureCanvas from 'react-signature-canvas';
import { FaUser, FaIdCard, FaCalendar, FaCamera, FaUsers, FaSignature, FaExclamationTriangle, FaBug } from 'react-icons/fa';
import { useNavigate, useParams } from 'react-router-dom';

// Configuration
const API_BASE_URL = 'http://localhost:8001/api'; // Change this to match your API
const USE_MOCK_DATA = false; // Set to true to use mock data instead of API
const DEBUG_MODE = true; // Enable to see detailed API responses

// Mock data for testing when API is not available
const MOCK_DATA = {
  success: true,
  owner: {
    firstName: 'John',
    lastName: 'Doe',
    age: 35,
    residenceNum: 'RES-123456',
    memberCount: 2,
    startDate: '2023-01-01',
    endDate: '2024-12-31',
    profilePhotoUrl: 'https://via.placeholder.com/150',
    nicFrontUrl: 'https://via.placeholder.com/300x200',
    nicBackUrl: 'https://via.placeholder.com/300x200',
    signatureUrl: 'https://via.placeholder.com/300x100'
  }
};

const InputLabel = ({ icon: Icon, label }) => (
  <label className="flex items-center text-gray-700 font-medium text-sm mb-1">
    {Icon && <Icon className="mr-2 text-blue-600" />} {label}
  </label>
);

const EditOwner = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // Get owner ID from URL params
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [debug, setDebug] = useState(null); // For holding debug information
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    age: '',
    residenceNum: '',
    memberCount: '',
    startDate: '',
    endDate: '',
    termsAccepted: false
  });

  const [files, setFiles] = useState({
    profilePhoto: null,
    nicFront: null,
    nicBack: null
  });

  // Track if user has uploaded new files
  const [filesChanged, setFilesChanged] = useState({
    profilePhoto: false,
    nicFront: false,
    nicBack: false
  });

  // Store existing file URLs for preview
  const [existingFiles, setExistingFiles] = useState({
    profilePhoto: null,
    nicFront: null,
    nicBack: null,
    signature: null
  });

  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const sigCanvas = useRef(null);
  const [signatureChanged, setSignatureChanged] = useState(false);

  // Format dates for form inputs (YYYY-MM-DD)
  const formatDate = (dateString) => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return ''; // Invalid date
      return date.toISOString().split('T')[0];
    } catch (error) {
      console.error('Error formatting date:', error);
      return '';
    }
  };

  // Process owner data regardless of format
  const processOwnerData = (data) => {
    // Try different possible data structures
    let owner = null;
    
    if (data?.owner) {
      // If data has owner property as expected
      owner = data.owner;
    } else if (data?.data?.owner) {
      // Some APIs nest data in a data property
      owner = data.data.owner;
    } else if (data?.data) {
      // If the owner data is directly in data property
      owner = data.data;
    } else if (typeof data === 'object' && !Array.isArray(data)) {
      // Assume the data itself is the owner object if it's an object and not an array
      owner = data;
    }
    
    if (!owner) {
      throw new Error('Could not find owner data in the API response');
    }
    
    // Log the owner object for debugging
    if (DEBUG_MODE) {
      console.log('Processed owner data:', owner);
      setDebug(prev => ({
        ...prev,
        processedOwner: owner
      }));
    }
    
    return owner;
  };

  // Fetch owner data when component mounts
  useEffect(() => {
    const fetchOwnerData = async () => {
      try {
        setLoading(true);
        setError(null);
        setDebug({}); // Reset debug info
        
        let data;
        let rawResponse;
        
        if (USE_MOCK_DATA) {
          // Use mock data for testing when API is not available
          console.log('Using mock data instead of API call');
          data = MOCK_DATA;
          // Simulate network delay
          await new Promise(resolve => setTimeout(resolve, 500));
        } else {
          // Make actual API call
          console.log(`Fetching owner data from API for ID: ${id}`);
          const response = await fetch(`${API_BASE_URL}/homeowner/owners/${id}`);
          rawResponse = response;
          
          if (DEBUG_MODE) {
            console.log('Response status:', response.status);
            console.log('Response status text:', response.statusText);
            console.log('Response headers:', [...response.headers.entries()]);
            setDebug(prev => ({
              ...prev,
              responseStatus: response.status,
              responseStatusText: response.statusText,
              responseHeaders: Object.fromEntries([...response.headers.entries()])
            }));
          }
          
          if (!response.ok) {
            throw new Error(`Failed to fetch owner data: ${response.status} ${response.statusText}`);
          }
          
          // Try to parse response as JSON
          try {
            data = await response.json();
            if (DEBUG_MODE) {
              console.log('API Raw Response:', data);
              setDebug(prev => ({
                ...prev,
                rawApiResponse: data
              }));
            }
          } catch (e) {
            console.error('Error parsing JSON:', e);
            const text = await response.text();
            setDebug(prev => ({
              ...prev,
              responseText: text
            }));
            throw new Error(`Invalid JSON response: ${e.message}`);
          }
        }
        
        // Process the owner data from whatever format the API returns
        try {
          const owner = processOwnerData(data);
          
          setFormData({
            firstName: owner.firstName || '',
            lastName: owner.lastName || '',
            age: owner.age || '',
            residenceNum: owner.residenceNum || owner.residence_num || '',
            memberCount: owner.memberCount || owner.member_count || '',
            startDate: formatDate(owner.startDate || owner.start_date),
            endDate: formatDate(owner.endDate || owner.end_date),
            termsAccepted: true // Already accepted when created
          });
          
          // Handle different possible image URL fields
          setExistingFiles({
            profilePhoto: owner.profilePhotoUrl || owner.profile_photo_url || owner.profilePhoto || owner.profile_photo || null,
            nicFront: owner.nicFrontUrl || owner.nic_front_url || owner.nicFront || owner.nic_front || null,
            nicBack: owner.nicBackUrl || owner.nic_back_url || owner.nicBack || owner.nic_back || null,
            signature: owner.signatureUrl || owner.signature_url || owner.signature || null
          });
        } catch (error) {
          console.error('Error processing owner data:', error);
          throw error;
        }
      } catch (error) {
        console.error('Error fetching owner data:', error);
        setError(error.message || 'Failed to fetch owner data');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchOwnerData();
    } else {
      navigate('/manage-owners');
    }
  }, [id, navigate]);

  // Update signature loaded flag when signature canvas is ready
  useEffect(() => {
    if (sigCanvas.current && existingFiles.signature && !signatureChanged) {
      try {
        const img = new Image();
        img.onload = () => {
          const ctx = sigCanvas.current.getCanvas().getContext('2d');
          ctx.drawImage(img, 0, 0);
        };
        img.onerror = () => {
          console.error('Error loading signature image');
        };
        img.src = existingFiles.signature;
      } catch (error) {
        console.error('Error setting signature:', error);
      }
    }
  }, [sigCanvas, existingFiles.signature, signatureChanged]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const val = type === 'checkbox' ? checked : value;

    setFormData(prev => ({
      ...prev,
      [name]: val
    }));
    
    // Clear error for this field when user starts typing
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  const handleFileChange = (e) => {
    const { name, files: uploadedFiles } = e.target;
    
    if (uploadedFiles && uploadedFiles.length > 0) {
      setFiles(prev => ({
        ...prev,
        [name]: uploadedFiles[0]
      }));
      
      // Mark this file as changed
      setFilesChanged(prev => ({
        ...prev,
        [name]: true
      }));
      
      // Clear error for this field when user uploads a file
      if (formErrors[name]) {
        setFormErrors(prev => ({
          ...prev,
          [name]: undefined
        }));
      }
    }
  };

  const handleSignatureChange = () => {
    setSignatureChanged(true);
    
    // Clear signature error if it exists
    if (formErrors.signature) {
      setFormErrors(prev => ({
        ...prev,
        signature: undefined
      }));
    }
  };

  const isPositiveInteger = (value) => {
    const num = Number(value);
    return Number.isInteger(num) && num > 0;
  };
  
  const isNonNegativeInteger = (value) => {
    const num = Number(value);
    return Number.isInteger(num) && num >= 0;
  };

  const validateForm = () => {
    const errors = {};

    // Basic required field validation
    if (!formData.firstName.trim()) errors.firstName = "First Name is required";
    if (!formData.lastName.trim()) errors.lastName = "Last Name is required";

    // Numeric field validation
    if (!formData.age || !isPositiveInteger(formData.age)) {
      errors.age = "Age must be a positive number greater than 0";
    }

    if (!formData.memberCount || !isNonNegativeInteger(formData.memberCount)) {
      errors.memberCount = "Member Count must be a number 0 or greater";
    }

    // Date validation
    if (!formData.startDate) {
      errors.startDate = "Start Date is required";
    }
    
    if (!formData.endDate) {
      errors.endDate = "End Date is required";
    } else if (formData.startDate && new Date(formData.endDate) <= new Date(formData.startDate)) {
      errors.endDate = "End Date must be after Start Date";
    }

    // File validation - only check if file was changed and no existing file
    if (filesChanged.profilePhoto && !files.profilePhoto && !existingFiles.profilePhoto) {
      errors.profilePhoto = "Profile Photo is required";
    }
    
    if (filesChanged.nicFront && !files.nicFront && !existingFiles.nicFront) {
      errors.nicFront = "NIC Front Photo is required";
    }
    
    if (filesChanged.nicBack && !files.nicBack && !existingFiles.nicBack) {
      errors.nicBack = "NIC Back Photo is required";
    }
    
    // Signature validation - only check if signature was changed and is empty
    if (signatureChanged && sigCanvas.current && sigCanvas.current.isEmpty()) {
      errors.signature = "Signature is required";
    }
    
    // Terms acceptance validation
    if (!formData.termsAccepted) {
      errors.termsAccepted = "You must accept the Terms and Conditions";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    setError(null);

    try {
      const submitData = new FormData();
      
      // Add all text fields to form data
      Object.keys(formData).forEach(key => {
        submitData.append(key, formData[key]);
      });
      
      // Add file uploads to form data only if they were changed
      Object.keys(files).forEach(key => {
        if (filesChanged[key] && files[key]) {
          submitData.append(key, files[key]);
        }
      });
      
      // Convert signature canvas to data URL and add to form data only if changed
      if (signatureChanged && sigCanvas.current && !sigCanvas.current.isEmpty()) {
        const signatureData = sigCanvas.current.toDataURL('image/png');
        submitData.append('signature', signatureData);
      }

      // Add flags to indicate which files were changed
      Object.keys(filesChanged).forEach(key => {
        submitData.append(`${key}Changed`, filesChanged[key]);
      });
      submitData.append('signatureChanged', signatureChanged);

      let data;
      
      if (USE_MOCK_DATA) {
        // Simulate successful update with mock data
        console.log('Using mock data instead of API update');
        await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay
        data = { success: true };
      } else {
        // Submit form data to API endpoint using PUT for update
        console.log(`Updating owner data for ID: ${id}`);
        const response = await fetch(`${API_BASE_URL}/homeowner/owners/${id}`, {
          method: 'PUT',
          body: submitData,
          // Don't set Content-Type header, it will be automatically set with boundary
        });

        if (DEBUG_MODE) {
          console.log('Update response status:', response.status);
          console.log('Update response status text:', response.statusText);
          setDebug(prev => ({
            ...prev,
            updateResponseStatus: response.status,
            updateResponseStatusText: response.statusText
          }));
        }

        if (!response.ok) {
          throw new Error(`Failed to update owner: ${response.status} ${response.statusText}`);
        }

        try {
          data = await response.json();
          if (DEBUG_MODE) {
            console.log('Update response:', data);
            setDebug(prev => ({
              ...prev,
              updateResponse: data
            }));
          }
        } catch (e) {
          console.error('Error parsing JSON response:', e);
          const text = await response.text();
          setDebug(prev => ({
            ...prev,
            updateResponseText: text
          }));
          throw new Error(`Invalid JSON response: ${e.message}`);
        }
      }
      
      // More flexible success checking
      const isSuccess = data?.success === true || data?.status === 'success' || data?.statusCode === 200;
      
      if (isSuccess) {
        // Show success message
        setSubmitSuccess(true);
        
        // Auto-hide success message after 3 seconds and navigate
        setTimeout(() => {
          setSubmitSuccess(false);
          navigate('/manage-owners');
        }, 3000);
      } else {
        throw new Error(data?.error || data?.message || 'Failed to update owner');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setError(error.message || 'Failed to update owner');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Debug panel that can be toggled on/off
  const DebugPanel = () => {
    if (!DEBUG_MODE || !debug) return null;
    
    return (
      <div className="mt-8 bg-gray-100 p-4 rounded-md border border-gray-300">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-md font-semibold flex items-center">
            <FaBug className="mr-2 text-amber-600" /> Debug Information
          </h3>
        </div>
        <pre className="text-xs bg-gray-800 text-green-400 p-3 rounded overflow-auto max-h-96">
          {JSON.stringify(debug, null, 2)}
        </pre>
      </div>
    );
  };

  // If there's an error on initial data load, show error state
  if (error && loading === false) {
    return (
      <div className="max-w-4xl mx-auto bg-white shadow-xl rounded-xl p-6 md:p-10 mt-6 md:mt-10 border border-gray-200">
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
          <div className="flex items-center">
            <FaExclamationTriangle className="text-red-500 mr-3" />
            <p className="text-red-700 font-medium">Error: {error}</p>
          </div>
          <p className="text-red-600 mt-2">Please check your connection to the backend server or verify that the owner ID exists.</p>
          <div className="mt-4">
            <button 
              onClick={() => window.location.reload()}
              className="mr-3 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            >
              Try Again
            </button>
            <button 
              onClick={() => navigate('/manage-owners')}
              className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
            >
              Return to Owner List
            </button>
          </div>
        </div>
        
        {DEBUG_MODE && debug && <DebugPanel />}
      </div>
    );
  }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto bg-white shadow-xl rounded-xl p-6 md:p-10 mt-6 md:mt-10 border border-gray-200 flex items-center justify-center h-64">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
          <p className="text-gray-600">Loading owner data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto bg-white shadow-xl rounded-xl p-6 md:p-10 mt-6 md:mt-10 border border-gray-200">
      <h1 className="text-2xl md:text-3xl font-bold text-blue-700 mb-6 flex items-center">
        <span className="mr-2">✏️</span> Edit Apartment Owner
      </h1>
      
      {submitSuccess && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6 flex items-center">
          <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
          </svg>
          <p className="font-medium">Owner updated successfully! Redirecting to owner list...</p>
        </div>
      )}
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6 flex items-center">
          <FaExclamationTriangle className="h-5 w-5 mr-2" />
          <p className="font-medium">Error: {error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="col-span-full border-b pb-2 mb-4 text-lg text-gray-600 font-semibold flex items-center">
          <span className="mr-2">👤</span> Personal Information
        </div>

        <div>
          <InputLabel icon={FaUser} label="First Name *" />
          <input 
            type="text" 
            name="firstName" 
            value={formData.firstName} 
            onChange={handleChange}
            className={`w-full p-2 border rounded-md focus:ring focus:ring-blue-300 ${formErrors.firstName ? 'border-red-500' : 'border-gray-300'}`}
            placeholder="Enter first name"
          />
          {formErrors.firstName && <p className="text-red-500 text-xs mt-1">{formErrors.firstName}</p>}
        </div>

        <div>
          <InputLabel icon={FaUser} label="Last Name *" />
          <input 
            type="text" 
            name="lastName" 
            value={formData.lastName} 
            onChange={handleChange}
            className={`w-full p-2 border rounded-md focus:ring focus:ring-blue-300 ${formErrors.lastName ? 'border-red-500' : 'border-gray-300'}`}
            placeholder="Enter last name"
          />
          {formErrors.lastName && <p className="text-red-500 text-xs mt-1">{formErrors.lastName}</p>}
        </div>

        <div>
          <InputLabel icon={FaCalendar} label="Age *" />
          <input 
            type="number" 
            name="age" 
            value={formData.age} 
            onChange={handleChange}
            min="1"
            className={`w-full p-2 border rounded-md focus:ring focus:ring-blue-300 ${formErrors.age ? 'border-red-500' : 'border-gray-300'}`}
            placeholder="Enter age"
          />
          {formErrors.age && <p className="text-red-500 text-xs mt-1">{formErrors.age}</p>}
        </div>

        <div>
          <InputLabel icon={FaUsers} label="Member Count *" />
          <input 
            type="number" 
            name="memberCount" 
            value={formData.memberCount} 
            onChange={handleChange}
            min="0"
            className={`w-full p-2 border rounded-md focus:ring focus:ring-blue-300 ${formErrors.memberCount ? 'border-red-500' : 'border-gray-300'}`}
            placeholder="Number of household members"
          />
          {formErrors.memberCount && <p className="text-red-500 text-xs mt-1">{formErrors.memberCount}</p>}
        </div>

        <div>
          <InputLabel icon={FaCalendar} label="Start Date *" />
          <input 
            type="date" 
            name="startDate" 
            value={formData.startDate} 
            onChange={handleChange}
            className={`w-full p-2 border rounded-md focus:ring focus:ring-blue-300 ${formErrors.startDate ? 'border-red-500' : 'border-gray-300'}`}
          />
          {formErrors.startDate && <p className="text-red-500 text-xs mt-1">{formErrors.startDate}</p>}
        </div>

        <div>
          <InputLabel icon={FaCalendar} label="End Date *" />
          <input 
            type="date" 
            name="endDate" 
            value={formData.endDate} 
            onChange={handleChange}
            className={`w-full p-2 border rounded-md focus:ring focus:ring-blue-300 ${formErrors.endDate ? 'border-red-500' : 'border-gray-300'}`}
          />
          {formErrors.endDate && <p className="text-red-500 text-xs mt-1">{formErrors.endDate}</p>}
        </div>

        <div>
          <InputLabel icon={FaIdCard} label="Residence Number" />
          <input 
            type="text" 
            name="residenceNum" 
            value={formData.residenceNum} 
            readOnly
            className="w-full p-2 bg-gray-100 border border-gray-300 rounded-md cursor-not-allowed"
          />
          <p className="text-xs text-gray-500 mt-1">Unique ID (cannot be changed)</p>
        </div>

        <div className="col-span-full border-b pb-2 mb-4 text-lg text-gray-600 font-semibold flex items-center">
          <span className="mr-2">📷</span> Upload Documents
        </div>
        
        <div>
          <InputLabel icon={FaCamera} label="Profile Photo" />
          {existingFiles.profilePhoto && (
            <div className="mb-2">
              <p className="text-xs text-gray-600 mb-1">Current photo:</p>
              <img 
                src={existingFiles.profilePhoto} 
                alt="Current profile" 
                className="h-20 w-20 object-cover rounded-md border border-gray-300" 
                onError={(e) => {
                  console.error('Error loading profile image');
                  e.target.src = 'https://via.placeholder.com/150?text=No+Image';
                }}
              />
            </div>
          )}
          <input 
            type="file" 
            name="profilePhoto" 
            onChange={handleFileChange}
            accept="image/*"
            className={`w-full border p-2 rounded-md ${formErrors.profilePhoto ? 'border-red-500' : 'border-gray-300'}`}
          />
          {formErrors.profilePhoto && <p className="text-red-500 text-xs mt-1">{formErrors.profilePhoto}</p>}
          <p className="text-xs text-gray-500 mt-1">Upload new photo only if you want to change it</p>
        </div>
        
        <div>
          <InputLabel icon={FaCamera} label="NIC Front" />
          {existingFiles.nicFront && (
            <div className="mb-2">
              <p className="text-xs text-gray-600 mb-1">Current NIC front:</p>
              <img 
                src={existingFiles.nicFront} 
                alt="Current NIC front" 
                className="h-20 w-32 object-cover rounded-md border border-gray-300" 
                onError={(e) => {
                  console.error('Error loading NIC front image');
                  e.target.src = 'https://via.placeholder.com/300x200?text=No+Image';
                }}
              />
            </div>
          )}
          <input 
            type="file" 
            name="nicFront" 
            onChange={handleFileChange}
            accept="image/*"
            className={`w-full border p-2 rounded-md ${formErrors.nicFront ? 'border-red-500' : 'border-gray-300'}`}
          />
          {formErrors.nicFront && <p className="text-red-500 text-xs mt-1">{formErrors.nicFront}</p>}
          <p className="text-xs text-gray-500 mt-1">Upload new photo only if you want to change it</p>
        </div>
        
        <div>
          <InputLabel icon={FaCamera} label="NIC Back" />
          {existingFiles.nicBack && (
            <div className="mb-2">
              <p className="text-xs text-gray-600 mb-1">Current NIC back:</p>
              <img 
                src={existingFiles.nicBack} 
                alt="Current NIC back" 
                className="h-20 w-32 object-cover rounded-md border border-gray-300" 
                onError={(e) => {
                  console.error('Error loading NIC back image');
                  e.target.src = 'https://via.placeholder.com/300x200?text=No+Image';
                }}
              />
            </div>
          )}
          <input 
            type="file" 
            name="nicBack" 
            onChange={handleFileChange}
            accept="image/*"
            className={`w-full border p-2 rounded-md ${formErrors.nicBack ? 'border-red-500' : 'border-gray-300'}`}
          />
          {formErrors.nicBack && <p className="text-red-500 text-xs mt-1">{formErrors.nicBack}</p>}
          <p className="text-xs text-gray-500 mt-1">Upload new photo only if you want to change it</p>
        </div>

        <div className="col-span-full">
          <div className="border border-gray-200 p-4 h-32 overflow-y-auto text-sm text-gray-700 rounded-md mb-2 bg-gray-50">
            <h3 className="font-semibold mb-2">Terms and Conditions</h3>
            <p>By accepting these Terms and Conditions, you agree to abide by all apartment rules and regulations. You consent to the collection and processing of your personal information for residence management purposes. You acknowledge responsibility for the accuracy of all submitted information.</p>
            <p className="mt-2">You also agree to maintain the property in good condition and report any damages or maintenance issues promptly.</p>
          </div>
          <label className="flex items-center text-sm">
            <input 
              type="checkbox" 
              name="termsAccepted" 
              checked={formData.termsAccepted} 
              onChange={handleChange} 
              className={`mr-2 h-4 w-4 ${formErrors.termsAccepted ? 'border-red-500' : ''}`}
            />
            I accept the Terms and Conditions
          </label>
          {formErrors.termsAccepted && <p className="text-red-500 text-xs mt-1">{formErrors.termsAccepted}</p>}
        </div>

        <div className="col-span-full">
          <InputLabel icon={FaSignature} label="Digital Signature" />
          {existingFiles.signature && !signatureChanged && (
            <div className="mb-2">
              <p className="text-xs text-gray-600 mb-1">Current signature:</p>
              <img 
                src={existingFiles.signature} 
                alt="Current signature" 
                className="h-20 max-w-full object-contain rounded-md border border-gray-300" 
                onError={(e) => {
                  console.error('Error loading signature image');
                  e.target.src = 'https://via.placeholder.com/300x100?text=No+Signature';
                }}
              />
            </div>
          )}
          <div className={`border rounded-md ${formErrors.signature ? 'border-red-500' : 'border-gray-200'}`}>
            <SignatureCanvas 
              ref={sigCanvas} 
              penColor="black" 
              canvasProps={{ 
                className: "w-full h-40 rounded-md",
                onMouseDown: handleSignatureChange,
                onTouchStart: handleSignatureChange
              }} 
              backgroundColor="rgba(240, 240, 240, 0.1)"
            />
          </div>
          <div className="mt-2 space-x-2">
            <button 
              type="button" 
              onClick={() => {
                sigCanvas.current.clear();
                setSignatureChanged(true);
              }}
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
            >
              Clear Signature
            </button>
          </div>
          {formErrors.signature && <p className="text-red-500 text-xs mt-1">{formErrors.signature}</p>}
          <p className="text-xs text-gray-500 mt-1">Sign again only if you want to change your signature</p>
        </div>

        <div className="col-span-full flex justify-between mt-6">
          <button 
            type="button" 
            onClick={() => navigate('/manageowner')}
            className="px-6 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-md shadow transition-colors"
          >
            Cancel
          </button>
          
          <button 
            type="submit" 
            className={`px-6 py-2 ${isSubmitting ? 'bg-gray-500' : 'bg-blue-600 hover:bg-blue-700'} text-white rounded-md shadow transition-colors flex items-center justify-center`}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Updating...
              </>
            ) : (
              <>💾 Save Changes</>
            )}
          </button>
        </div>
      </form>
      
      {/* Debug panel that shows API response details */}
      {DEBUG_MODE && <DebugPanel />}
    </div>
  );
};

export default EditOwner;