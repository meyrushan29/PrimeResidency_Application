import React, { useState, useEffect, useRef } from 'react';
import SignatureCanvas from 'react-signature-canvas';
import { FaUser, FaIdCard, FaCalendar, FaCamera, FaUsers, FaSignature } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const InputLabel = ({ icon: Icon, label }) => (
  <label className="flex items-center text-gray-700 font-medium text-sm mb-1">
    {Icon && <Icon className="mr-2 text-blue-600" />} {label}
  </label>
);

const AddOwner = () => {
  const navigate = useNavigate();
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

  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const sigCanvas = useRef(null);

  // Generate unique residence number on component mount
  useEffect(() => {
    const generateResidenceNumber = () => {
      const timestamp = Date.now();
      const randomSuffix = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
      return `RES-${timestamp}-${randomSuffix}`;
    };

    setFormData(prev => ({ 
      ...prev, 
      residenceNum: generateResidenceNumber() 
    }));
  }, []);

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
      
      // Clear error for this field when user uploads a file
      if (formErrors[name]) {
        setFormErrors(prev => ({
          ...prev,
          [name]: undefined
        }));
      }
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

    // File validation
    if (!files.profilePhoto) errors.profilePhoto = "Profile Photo is required";
    if (!files.nicFront) errors.nicFront = "NIC Front Photo is required";
    if (!files.nicBack) errors.nicBack = "NIC Back Photo is required";
    
    // Signature validation
    if (sigCanvas.current && sigCanvas.current.isEmpty()) {
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

    try {
      const submitData = new FormData();
      
      // Add all text fields to form data
      Object.keys(formData).forEach(key => {
        submitData.append(key, formData[key]);
      });
      
      // Add file uploads to form data
      Object.keys(files).forEach(key => {
        if (files[key]) {
          submitData.append(key, files[key]);
        }
      });
      
      // Convert signature canvas to data URL and add to form data
      if (sigCanvas.current && !sigCanvas.current.isEmpty()) {
        const signatureData = sigCanvas.current.toDataURL('image/png');
        submitData.append('signature', signatureData);
      }

      // Submit form data to API endpoint
      const response = await fetch('http://localhost:8001/api/homeowner/owners', {
        method: 'POST',
        body: submitData,
        // Don't set Content-Type header, it will be automatically set with boundary
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.success) {
        // Show success message
        setSubmitSuccess(true);
        
        // Reset form
        setFormData({
          firstName: '',
          lastName: '',
          age: '',
          residenceNum: `RES-${Date.now()}-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
          memberCount: '',
          startDate: '',
          endDate: '',
          termsAccepted: false
        });
        
        // Reset file uploads
        setFiles({
          profilePhoto: null,
          nicFront: null,
          nicBack: null
        });
        
        // Clear signature canvas
        if (sigCanvas.current) {
          sigCanvas.current.clear();
        }
        
        // Reset file input elements
        const fileInputs = document.querySelectorAll('input[type="file"]');
        fileInputs.forEach(input => {
          input.value = '';
        });
        
        // Auto-hide success message after 5 seconds and navigate
        setTimeout(() => {
          setSubmitSuccess(false);
          navigate('/manage-owners');
        }, 3000);
      } else {
        alert(`Error: ${data.error || 'Failed to add owner'}`);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      alert(`Failed to add owner: ${error.message || 'Unknown error'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-white shadow-xl rounded-xl p-6 md:p-10 mt-6 md:mt-10 border border-gray-200">
      <h1 className="text-2xl md:text-3xl font-bold text-blue-700 mb-6 flex items-center">
        <span className="mr-2">🏢</span> Add New Apartment Owner
      </h1>
      
      {submitSuccess && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6 flex items-center">
          <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
          </svg>
          <p className="font-medium">Owner added successfully! Redirecting to owner list...</p>
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
          <p className="text-xs text-gray-500 mt-1">Automatically generated unique ID</p>
        </div>

        <div className="col-span-full border-b pb-2 mb-4 text-lg text-gray-600 font-semibold flex items-center">
          <span className="mr-2">📷</span> Upload Documents
        </div>
        
        <div>
          <InputLabel icon={FaCamera} label="Profile Photo *" />
          <input 
            type="file" 
            name="profilePhoto" 
            onChange={handleFileChange}
            accept="image/*"
            className={`w-full border p-2 rounded-md ${formErrors.profilePhoto ? 'border-red-500' : 'border-gray-300'}`}
          />
          {formErrors.profilePhoto && <p className="text-red-500 text-xs mt-1">{formErrors.profilePhoto}</p>}
          <p className="text-xs text-gray-500 mt-1">Upload a clear face photo</p>
        </div>
        
        <div>
          <InputLabel icon={FaCamera} label="NIC Front *" />
          <input 
            type="file" 
            name="nicFront" 
            onChange={handleFileChange}
            accept="image/*"
            className={`w-full border p-2 rounded-md ${formErrors.nicFront ? 'border-red-500' : 'border-gray-300'}`}
          />
          {formErrors.nicFront && <p className="text-red-500 text-xs mt-1">{formErrors.nicFront}</p>}
          <p className="text-xs text-gray-500 mt-1">Upload front side of National ID Card</p>
        </div>
        
        <div>
          <InputLabel icon={FaCamera} label="NIC Back *" />
          <input 
            type="file" 
            name="nicBack" 
            onChange={handleFileChange}
            accept="image/*"
            className={`w-full border p-2 rounded-md ${formErrors.nicBack ? 'border-red-500' : 'border-gray-300'}`}
          />
          {formErrors.nicBack && <p className="text-red-500 text-xs mt-1">{formErrors.nicBack}</p>}
          <p className="text-xs text-gray-500 mt-1">Upload back side of National ID Card</p>
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
          <InputLabel icon={FaSignature} label="Digital Signature *" />
          <div className={`border rounded-md ${formErrors.signature ? 'border-red-500' : 'border-gray-200'}`}>
            <SignatureCanvas 
              ref={sigCanvas} 
              penColor="black" 
              canvasProps={{ 
                className: "w-full h-40 rounded-md" 
              }} 
              backgroundColor="rgba(240, 240, 240, 0.1)"
            />
          </div>
          <div className="mt-2 space-x-2">
            <button 
              type="button" 
              onClick={() => sigCanvas.current.clear()}
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
            >
              Clear Signature
            </button>
          </div>
          {formErrors.signature && <p className="text-red-500 text-xs mt-1">{formErrors.signature}</p>}
          <p className="text-xs text-gray-500 mt-1">Please sign using mouse or touchscreen</p>
        </div>

        <div className="col-span-full text-right mt-6">
          <button 
            type="submit" 
            className={`px-6 py-2 ${isSubmitting ? 'bg-gray-500' : 'bg-green-600 hover:bg-green-700'} text-white rounded-md shadow transition-colors flex items-center justify-center ml-auto`}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Submitting...
              </>
            ) : (
              <>✅ Add Owner</>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddOwner;