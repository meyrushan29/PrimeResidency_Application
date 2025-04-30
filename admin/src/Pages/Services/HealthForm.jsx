import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const HealthForm = () => {
  const [formData, setFormData] = useState({
    ownerId: '',
    name: '',
    email: '',
    phoneNumber: '',
    serviceType: '',
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
    setFormData(prevData => ({ ...prevData, [name]: value }));
  };

  const validateForm = () => {
    const validationErrors = {};
    const { ownerId, name, email, phoneNumber, serviceType, numberOfStaff, date, time } = formData;

    if (!ownerId) {
      validationErrors.ownerId = 'Owner ID is required';
    } else if (!/^Ow\d{4}$/.test(ownerId)) {
      validationErrors.ownerId = 'Owner ID must start with "Ow" and 4 digits (e.g., Ow1234)';
    }

    if (!name) validationErrors.name = 'Name is required';
    if (!email) {
      validationErrors.email = 'Email is required';
    } else if (!/^[\w.%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(email)) {
      validationErrors.email = 'Invalid email address';
    }
    if (!phoneNumber) {
      validationErrors.phoneNumber = 'Phone number is required';
    } else if (!/^\d{10}$/.test(phoneNumber)) {
      validationErrors.phoneNumber = 'Enter a valid 10-digit phone number';
    }
    if (!serviceType) validationErrors.serviceType = 'Service type is required';
    if (numberOfStaff < 1 || numberOfStaff > 10) {
      validationErrors.numberOfStaff = 'Choose between 1 to 10 staff';
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
      // You could send the formData to your API here.
    } else {
      setErrors(validationErrors);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-100 to-white p-10">
      <div className="relative max-w-lg mx-auto bg-white p-8 rounded-xl shadow-xl border border-gray-300">
        <button
          onClick={() => navigate('/ownerservices')}
          className="absolute top-4 left-4 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition duration-300 shadow-lg transform hover:scale-110"
        >
          &#8592;
        </button>

        <h1 className="text-3xl font-semibold text-red-700 mb-6 text-center">🏥 Health Service Request</h1>

        {isSubmitted ? (
          <div className="text-center text-red-600">
            <h2 className="text-2xl font-bold">Thank you for your request!</h2>
            <p className="mt-2 text-lg">We’ll contact you shortly.</p>
            <div className="mt-4 text-sm text-left">
              {Object.entries(formData).map(([key, value]) => (
                <p key={key}><strong>{key.replace(/([A-Z])/g, ' $1')}:</strong> {value}</p>
              ))}
            </div>
            <button
              onClick={() => navigate('/ownerservices')}
              className="mt-6 px-6 py-3 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600 transition duration-300"
            >
              More Services
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            {[
              { label: "Owner ID (e.g., Ow1234)", id: "ownerId", type: "text" },
              { label: "Full Name", id: "name", type: "text" },
              { label: "Email", id: "email", type: "email" },
              { label: "Phone Number", id: "phoneNumber", type: "tel" },
            ].map(({ label, id, type }) => (
              <div key={id} className="mb-4">
                <label htmlFor={id} className="block text-sm font-medium text-gray-700">{label}</label>
                <input
                  type={type}
                  id={id}
                  name={id}
                  value={formData[id]}
                  onChange={handleChange}
                  className="mt-1 p-3 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                />
                {errors[id] && <p className="text-red-600 text-sm">{errors[id]}</p>}
              </div>
            ))}

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
                {[...Array(10)].map((_, i) => (
                  <option key={i} value={i + 1}>{i + 1} {i === 0 ? 'Staff' : 'Staffs'}</option>
                ))}
              </select>
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
              className="w-full py-3 bg-red-500 text-white text-lg font-medium rounded-lg hover:bg-red-600 transition duration-300 focus:outline-none"
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
