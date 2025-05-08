import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const HealthForm = () => {
  const [formData, setFormData] = useState({
    ownerId: '',
    name: '',
    email: '',
    phoneNumber: '',
    serviceType: 'daily',
    numberOfStaff: 1,
    additionalNotes: '',
    date: '',
    time: '',
  });

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errors, setErrors] = useState({});
  const [submissionError, setSubmissionError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const validateForm = () => {
    const validationErrors = {};
    const {
      ownerId, name, email, phoneNumber, serviceType, numberOfStaff, date, time,
    } = formData;

    const ownerIdPattern = /^Ow\d{4}$/;
    if (!ownerId) {
      validationErrors.ownerId = 'Owner ID is required';
    } else if (!ownerIdPattern.test(ownerId)) {
      validationErrors.ownerId = 'Owner ID must start with "Ow" followed by 4 digits';
    }

    if (!name) {
      validationErrors.name = 'Name is required';
    }

    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!email) {
      validationErrors.email = 'Email is required';
    } else if (!emailPattern.test(email)) {
      validationErrors.email = 'Please enter a valid email address';
    }

    const phonePattern = /^[0-9]{10}$/;
    if (!phoneNumber) {
      validationErrors.phoneNumber = 'Phone number is required';
    } else if (!phonePattern.test(phoneNumber)) {
      validationErrors.phoneNumber = 'Please enter a valid 10-digit phone number';
    }

    if (!serviceType) {
      validationErrors.serviceType = 'Service type is required';
    }

    if (numberOfStaff < 1 || numberOfStaff > 10) {
      validationErrors.numberOfStaff = 'Please select a valid number of staff (1-10)';
    }

    if (!date) {
      validationErrors.date = 'Please select a date for the service';
    }

    if (!time) {
      validationErrors.time = 'Please select a time for the service';
    }

    return validationErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm();

    if (Object.keys(validationErrors).length === 0) {
      setErrors({});
      setSubmissionError('');

      try {
        const formattedData = {
          ...formData,
        };

        const response = await axios.post('http://localhost:8001/api/cleaningservice/cleaning', formattedData);

        if (response.status === 201) {
          setIsSubmitted(true);
          console.log('Cleaning request submitted successfully');
        }
      } catch (error) {
        console.error('Error submitting cleaning request:', error);
        if (error.response && error.response.data && error.response.data.message) {
          setSubmissionError(error.response.data.message);
        } else {
          setSubmissionError('Error submitting the request. Please try again.');
        }
      }
    } else {
      setErrors(validationErrors);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-100 to-white p-10">
      <div className="relative max-w-lg mx-auto bg-white p-8 rounded-xl shadow-xl border border-gray-300">
        
        {/* Back button */}
        <button
          onClick={() => navigate('/ownerservices')}
          className="absolute top-4 left-4 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition duration-300 shadow-lg transform hover:scale-110 focus:outline-none"
        >
          &#8592;
        </button>

        <h1 className="text-3xl font-semibold text-red-800 mb-6 text-center">🏥 Health Service Request</h1>

        {isSubmitted ? (
          <div className="text-center text-green-600">
            <h2 className="text-2xl font-bold">Thank you for your request!</h2>
            <p className="mt-2 text-lg">We will contact you shortly to confirm your service.</p>

            <button
              onClick={() => navigate('/ownerservices')}
              className="mt-6 px-6 py-3 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600 transition duration-300 shadow-md focus:outline-none focus:ring-2 focus:ring-red-400"
            >
              More Services
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            {/* Owner ID */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700" htmlFor="ownerId">
                Owner ID <span className="text-xs text-gray-500">(Format: Ow1234)</span>
              </label>
              <input
                type="text"
                id="ownerId"
                name="ownerId"
                value={formData.ownerId}
                onChange={handleChange}
                className="mt-1 p-3 w-full border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 transition duration-300"
              />
              {errors.ownerId && <p className="text-red-600 text-sm">{errors.ownerId}</p>}
            </div>

            {/* Name */}
            <div className="mb-4">
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">Full Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="mt-1 p-3 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              />
              {errors.name && <p className="text-red-600 text-sm">{errors.name}</p>}
            </div>

            {/* Email */}
            <div className="mb-4">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="mt-1 p-3 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              />
              {errors.email && <p className="text-red-600 text-sm">{errors.email}</p>}
            </div>

            {/* Phone Number */}
            <div className="mb-4">
              <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700">Phone Number</label>
              <input
                type="tel"
                id="phoneNumber"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                className="mt-1 p-3 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              />
              {errors.phoneNumber && <p className="text-red-600 text-sm">{errors.phoneNumber}</p>}
            </div>

            {/* Service Type */}
            <div className="mb-4">
              <label htmlFor="serviceType" className="block text-sm font-medium text-gray-700">Service Type</label>
              <select
                id="serviceType"
                name="serviceType"
                value={formData.serviceType}
                onChange={handleChange}
                className="mt-1 p-3 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="bi-weekly">Bi-Weekly</option>
                <option value="monthly">Monthly</option>
              </select>
              {errors.serviceType && <p className="text-red-600 text-sm">{errors.serviceType}</p>}
            </div>

            {/* Number of Staff */}
            <div className="mb-4">
              <label htmlFor="numberOfStaff" className="block text-sm font-medium text-gray-700">Number of Staff</label>
              <input
                type="number"
                id="numberOfStaff"
                name="numberOfStaff"
                value={formData.numberOfStaff}
                onChange={handleChange}
                className="mt-1 p-3 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                min="1"
                max="10"
              />
              {errors.numberOfStaff && <p className="text-red-600 text-sm">{errors.numberOfStaff}</p>}
            </div>

            {/* Date */}
            <div className="mb-4">
              <label htmlFor="date" className="block text-sm font-medium text-gray-700">Preferred Date</label>
              <input
                type="date"
                id="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className="mt-1 p-3 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              />
              {errors.date && <p className="text-red-600 text-sm">{errors.date}</p>}
            </div>

            {/* Time */}
            <div className="mb-4">
              <label htmlFor="time" className="block text-sm font-medium text-gray-700">Preferred Time</label>
              <input
                type="time"
                id="time"
                name="time"
                value={formData.time}
                onChange={handleChange}
                className="mt-1 p-3 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              />
              {errors.time && <p className="text-red-600 text-sm">{errors.time}</p>}
            </div>

            {/* Additional Notes */}
            <div className="mb-4">
              <label htmlFor="additionalNotes" className="block text-sm font-medium text-gray-700">Additional Notes</label>
              <textarea
                id="additionalNotes"
                name="additionalNotes"
                value={formData.additionalNotes}
                onChange={handleChange}
                className="mt-1 p-3 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-3 px-4 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600 transition duration-300"
            >
              Request Health Service
            </button>

            {/* Submission Error */}
            {submissionError && (
              <p className="text-red-600 text-sm mt-4 text-center">{submissionError}</p>
            )}
          </form>
        )}
      </div>
    </div>
  );
};

export default HealthForm;
