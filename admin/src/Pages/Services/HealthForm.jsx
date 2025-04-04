import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const HealthForm = () => {
  const [formData, setFormData] = useState({
    ownerId: '',
    name: '',
    email: '',
    phoneNumber: '',
    serviceType: '', // No default value
    numberOfStaff: 1,
    additionalNotes: '',
    date: '',
    time: '',
  });

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errors, setErrors] = useState({});
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
    const { ownerId, name, email, phoneNumber, serviceType, numberOfStaff, date, time } = formData;

    const ownerIdPattern = /^Ow\d{4}$/;
    if (!ownerId) {
      validationErrors.ownerId = 'Owner ID is required';
    } else if (!ownerIdPattern.test(ownerId)) {
      validationErrors.ownerId = 'Owner ID must start with "Ow" and be followed by 4 digits (e.g., Ow1234)';
    }

    if (!name) validationErrors.name = 'Name is required';

    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!email) {
      validationErrors.email = 'Email is required';
    } else if (!emailPattern.test(email)) {
      validationErrors.email = 'Invalid email address';
    }

    const phonePattern = /^[0-9]{10}$/;
    if (!phoneNumber) {
      validationErrors.phoneNumber = 'Phone number is required';
    } else if (!phonePattern.test(phoneNumber)) {
      validationErrors.phoneNumber = 'Enter a valid 10-digit phone number';
    }

    if (!serviceType) validationErrors.serviceType = 'Service type is required';

    if (numberOfStaff < 1 || numberOfStaff > 10) {
      validationErrors.numberOfStaff = 'Choose 1 to 10 staff members';
    }

    if (!date) validationErrors.date = 'Service date is required';
    if (!time) validationErrors.time = 'Service time is required';

    return validationErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validateForm();

    if (Object.keys(validationErrors).length === 0) {
      setIsSubmitted(true);
      setErrors({});
    } else {
      setErrors(validationErrors);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-100 to-white p-10">
      <div className="relative max-w-lg mx-auto bg-white p-8 rounded-xl shadow-xl border border-gray-300">

        <button
          onClick={() => navigate('/ownerserevices')}
          className="absolute top-4 left-4 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition duration-300 shadow-lg transform hover:scale-110 focus:outline-none"
        >
          &#8592;
        </button>

        <h1 className="text-3xl font-semibold text-red-700 mb-6 text-center">🏥 Health Service Request</h1>

        {isSubmitted ? (
                    <div className="text-center text-red-600">
                    <h2 className="text-2xl font-bold">Thank you for your request!</h2>
                     <p className="mt-2 text-lg">We’ll contact you shortly to confirm your service.</p>
                    <div className="mt-4 text-sm text-left">
      <p><strong>Owner ID:</strong> {formData.ownerId}</p>
      <p><strong>Name:</strong> {formData.name}</p>
      <p><strong>Email:</strong> {formData.email}</p>
      <p><strong>Phone Number:</strong> {formData.phoneNumber}</p>
      <p><strong>Service Type:</strong> {formData.serviceType}</p>
      <p><strong>Number of Staff:</strong> {formData.numberOfStaff}</p>
      <p><strong>Additional Notes:</strong> {formData.additionalNotes}</p>
      <p><strong>Service Date:</strong> {formData.date}</p>
      <p><strong>Service Time:</strong> {formData.time}</p>
    </div>

    {/* More button that navigates to /ownerservices */}
    <button
      onClick={() => navigate('/ownerserevices')}
      className="mt-6 px-6 py-3 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600 transition duration-300 shadow-md focus:outline-none focus:ring-2 focus:ring-red-400"
    >
      More Services
    </button>
  </div>
) : (
  // ...rest of the form

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="ownerId" className="block text-sm font-medium text-gray-700">
                Owner ID (e.g., Ow1234)
              </label>
              <input
                type="text"
                id="ownerId"
                name="ownerId"
                value={formData.ownerId}
                onChange={handleChange}
                className="mt-1 p-3 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
              />
              {errors.ownerId && <p className="text-red-600 text-sm">{errors.ownerId}</p>}
            </div>

            <div className="mb-4">
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">Full Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="mt-1 p-3 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
              />
              {errors.name && <p className="text-red-600 text-sm">{errors.name}</p>}
            </div>

            <div className="mb-4">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="mt-1 p-3 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
              />
              {errors.email && <p className="text-red-600 text-sm">{errors.email}</p>}
            </div>

            <div className="mb-4">
              <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700">Phone Number</label>
              <input
                type="tel"
                id="phoneNumber"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                className="mt-1 p-3 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
              />
              {errors.phoneNumber && <p className="text-red-600 text-sm">{errors.phoneNumber}</p>}
            </div>

            <div className="mb-4">
              <label htmlFor="serviceType" className="block text-sm font-medium text-gray-700">Service Type</label>
              <select
                id="serviceType"
                name="serviceType"
                value={formData.serviceType}
                onChange={handleChange}
                className="mt-1 p-3 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
              >
                <option value="">-- Select Service --</option>
                <option value="nursing">Nursing</option>
                <option value="physiotherapy">Physiotherapy</option>
                <option value="homecare">Home Care</option>
              </select>
              {errors.serviceType && <p className="text-red-600 text-sm">{errors.serviceType}</p>}
            </div>

            <div className="mb-4">
              <label htmlFor="numberOfStaff" className="block text-sm font-medium text-gray-700">Number of Staff</label>
              <select
                id="numberOfStaff"
                name="numberOfStaff"
                value={formData.numberOfStaff}
                onChange={handleChange}
                className="mt-1 p-3 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
              >
                {[...Array(10).keys()].map((num) => (
                  <option key={num} value={num + 1}>
                    {num + 1} {num + 1 === 1 ? 'Staff' : 'Staffs'}
                  </option>
                ))}
              </select>
              {errors.numberOfStaff && <p className="text-red-600 text-sm">{errors.numberOfStaff}</p>}
            </div>

            <div className="mb-4">
              <label htmlFor="date" className="block text-sm font-medium text-gray-700">Service Date</label>
              <input
                type="date"
                id="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className="mt-1 p-3 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
              />
              {errors.date && <p className="text-red-600 text-sm">{errors.date}</p>}
            </div>

            <div className="mb-4">
              <label htmlFor="time" className="block text-sm font-medium text-gray-700">Service Time</label>
              <input
                type="time"
                id="time"
                name="time"
                value={formData.time}
                onChange={handleChange}
                className="mt-1 p-3 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
              />
              {errors.time && <p className="text-red-600 text-sm">{errors.time}</p>}
            </div>

            <div className="mb-4">
              <label htmlFor="additionalNotes" className="block text-sm font-medium text-gray-700">Additional Notes</label>
              <textarea
                id="additionalNotes"
                name="additionalNotes"
                value={formData.additionalNotes}
                onChange={handleChange}
                rows="4"
                className="mt-1 p-3 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-red-500 text-white text-lg font-medium rounded-lg hover:bg-red-600 transition duration-300 focus:outline-none focus:ring-4 focus:ring-red-300"
            >
              Submit Health Service Request
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default HealthForm;
