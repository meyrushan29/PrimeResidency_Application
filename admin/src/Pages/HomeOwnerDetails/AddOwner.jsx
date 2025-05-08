import React, { useState, useEffect, useRef } from 'react';
import SignatureCanvas from 'react-signature-canvas';

const AddOwner = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    age: '',
    residenceNum: '',
    memberCount: '',
    startDate: '',
    endDate: '',
    profilePhoto: null,
    nicFront: null,
    nicBack: null,
    signature: '',
    termsAccepted: false
  });

  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const sigCanvas = useRef(null);

  useEffect(() => {
    const generateResidenceNum = () => `RES-${Date.now()}`;
    setFormData(prev => ({ ...prev, residenceNum: generateResidenceNum() }));
  }, []);

  const handleChange = (e) => {
    const { name, value, type, files, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'file' ? files[0] : type === 'checkbox' ? checked : value
    });
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.firstName.trim()) errors.firstName = "First Name is required";
    if (!formData.lastName.trim()) errors.lastName = "Last Name is required";
    if (!formData.age || formData.age < 0) errors.age = "Age must be 0 or greater";
    if (!formData.memberCount || formData.memberCount <= 0) errors.memberCount = "Member Count must be greater than 0";
    if (!formData.startDate) errors.startDate = "Start Date is required";
    if (!formData.endDate) errors.endDate = "End Date is required";
    if (!formData.profilePhoto) errors.profilePhoto = "Profile Photo is required";
    if (!formData.nicFront) errors.nicFront = "NIC Front Photo is required";
    if (!formData.nicBack) errors.nicBack = "NIC Back Photo is required";
    if (!formData.signature) errors.signature = "Signature is required";
    if (!formData.termsAccepted) errors.termsAccepted = "You must accept the Terms and Conditions";

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsSubmitting(true);

    try {
      const submitData = new FormData();
      Object.keys(formData).forEach(key => {
        submitData.append(key, formData[key]);
      });

      const response = await fetch('http://localhost:8001/api/owners', {
        method: 'POST',
        body: submitData,
      });

      const data = await response.json();
      if (data.success) {
        alert('Owner added successfully!');
        setFormData({
          firstName: '',
          lastName: '',
          age: '',
          residenceNum: `RES-${Date.now()}`,
          memberCount: '',
          startDate: '',
          endDate: '',
          profilePhoto: null,
          nicFront: null,
          nicBack: null,
          signature: '',
          termsAccepted: false
        });
        sigCanvas.current.clear();
      } else {
        alert(`Error: ${data.error || 'Failed to add owner'}`);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Failed to add owner. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Add Owner</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Text Inputs */}
        {['firstName', 'lastName', 'age', 'memberCount', 'startDate', 'endDate'].map(field => (
          <div key={field}>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {field.replace(/([A-Z])/g, ' $1').trim()} *
            </label>
            <input
              type={field.includes('Date') ? 'date' : (field === 'age' || field === 'memberCount') ? 'number' : 'text'}
              name={field}
              value={formData[field]}
              min={field === 'memberCount' ? 1 : field === 'age' ? 0 : undefined}
              onChange={handleChange}
              className={`w-full p-2 border ${formErrors[field] ? 'border-red-500' : 'border-gray-300'} rounded-md focus:ring-blue-500 focus:border-blue-500`}
              required
            />
            {formErrors[field] && <p className="mt-1 text-xs text-red-500">{formErrors[field]}</p>}
          </div>
        ))}

        {/* Residence Number (Read-only) */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Residence Number</label>
          <input type="text" name="residenceNum" value={formData.residenceNum} readOnly className="w-full p-2 border border-gray-300 rounded-md" />
        </div>

        {/* File Uploads */}
        {['profilePhoto', 'nicFront', 'nicBack'].map(field => (
          <div key={field}>
            <label className="block text-sm font-medium text-gray-700 mb-1">{field.replace(/([A-Z])/g, ' $1').trim()} *</label>
            <input type="file" name={field} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-md" required />
            {formErrors[field] && <p className="mt-1 text-xs text-red-500">{formErrors[field]}</p>}
          </div>
        ))}

        {/* Terms and Conditions */}
        <div>
          <div className="h-32 overflow-y-auto border border-gray-300 p-4 mb-2 text-sm text-gray-700">
            <b>1. Lease Term</b><br />
            The lease agreement is for a term of [Insert Term, e.g., 12 months] beginning on [Insert Start Date] and ending on [Insert End Date].

Renewal of the lease is subject to mutual agreement between the tenant and landlord.<br /><br />
            <b>2. Rent Payment</b><br />
            The rent is [Insert Amount] per month, payable on the [Insert Date, e.g., first] of each month.

Payments should be made by [Insert Payment Method, e.g., check, direct deposit, etc.].

Late payments will incur a fee of [Insert Late Fee] after a [Insert Grace Period, e.g., 5 days] grace period.

If rent is not paid within [Insert Days] days, the landlord reserves the right to begin eviction proceedings<br /><br />
            {/* Shortened for brevity; insert your full terms if needed */}
          </div>
          <div>
            <input type="checkbox" name="termsAccepted" checked={formData.termsAccepted} onChange={handleChange} required /> I accept the Terms and Conditions
            {formErrors.termsAccepted && <p className="mt-1 text-xs text-red-500">{formErrors.termsAccepted}</p>}
          </div>
        </div>

        {/* Signature */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Digital Signature *</label>
          <SignatureCanvas ref={sigCanvas} penColor="black" canvasProps={{ className: "border w-full h-32" }} />
          <button type="button" onClick={() => setFormData({ ...formData, signature: sigCanvas.current.toDataURL() })} className="mt-2 px-4 py-2 bg-gray-500 text-white rounded">
            Save Signature
          </button>
          {formErrors.signature && <p className="mt-1 text-xs text-red-500">{formErrors.signature}</p>}
        </div>

        {/* Submit Button */}
        <button type="submit" className="px-6 py-2 bg-blue-600 text-white rounded-md" disabled={isSubmitting}>
          {isSubmitting ? 'Submitting...' : 'Add Owner'}
        </button>
      </form>
    </div>
  );
};

export default AddOwner;
