import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const SecurityForm = () => {
  const [formData, setFormData] = useState({
    ownerId: '',
    name: '',
    email: '',
    phoneNumber: '',
    serviceType: '',
    numberOfGuards: 1,
    additionalNotes: '',
    date: '',
    time: '',
  });

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validateForm = () => {
    const validationErrors = {};
    const { ownerId, name, email, phoneNumber, serviceType, numberOfGuards, date, time } = formData;

    const ownerIdPattern = /^Ow\d{4}$/;
    if (!ownerId) {
      validationErrors.ownerId = 'Owner ID is required';
    } else if (!ownerIdPattern.test(ownerId)) {
      validationErrors.ownerId = 'Owner ID must start with "Ow" and be followed by 4 digits (e.g., Ow1234)';
    }

    if (!name) validationErrors.name = 'Name is required';

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) validationErrors.email = 'Email is required';
    else if (!emailPattern.test(email)) validationErrors.email = 'Invalid email address';

    const phonePattern = /^\d{10}$/;
    if (!phoneNumber) validationErrors.phoneNumber = 'Phone number is required';
    else if (!phonePattern.test(phoneNumber)) validationErrors.phoneNumber = 'Enter a valid 10-digit phone number';

    if (!serviceType) validationErrors.serviceType = 'Service type is required';

    if (numberOfGuards < 1 || numberOfGuards > 10) {
      validationErrors.numberOfGuards = 'Choose 1 to 10 guards';
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
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 to-white p-10">
      <div className="relative max-w-lg mx-auto bg-white p-8 rounded-xl shadow-xl border border-gray-300">

        <button
          onClick={() => navigate('/ownerservices')}
          className="absolute top-4 left-4 p-2 bg-indigo-500 text-white rounded-full hover:bg-indigo-600 transition duration-300 shadow-lg transform hover:scale-110 focus:outline-none"
        >
          &#8592;
        </button>

        <h1 className="text-3xl font-semibold text-indigo-700 mb-6 text-center">🛡️ Security Service Request</h1>

        {isSubmitted ? (
          <div className="text-center text-indigo-600">
            <h2 className="text-2xl font-bold">Request Submitted!</h2>
            <p className="mt-2 text-lg">We’ll contact you shortly with security arrangements.</p>
            <div className="mt-4 text-sm text-left">
              <p><strong>Owner ID:</strong> {formData.ownerId}</p>
              <p><strong>Name:</strong> {formData.name}</p>
              <p><strong>Email:</strong> {formData.email}</p>
              <p><strong>Phone Number:</strong> {formData.phoneNumber}</p>
              <p><strong>Service Type:</strong> {formData.serviceType}</p>
              <p><strong>Number of Guards:</strong> {formData.numberOfGuards}</p>
              <p><strong>Additional Notes:</strong> {formData.additionalNotes}</p>
              <p><strong>Service Date:</strong> {formData.date}</p>
              <p><strong>Service Time:</strong> {formData.time}</p>
            </div>

            <button
              onClick={() => navigate('/ownerserevices')}
              className="mt-6 px-6 py-3 bg-indigo-500 text-white font-semibold rounded-lg hover:bg-indigo-600 transition duration-300 shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
            >
              More Services
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            {/* Input fields */}
            {[
              { id: 'ownerId', label: 'Owner ID (e.g., Ow1234)', type: 'text' },
              { id: 'name', label: 'Full Name', type: 'text' },
              { id: 'email', label: 'Email', type: 'email' },
              { id: 'phoneNumber', label: 'Phone Number', type: 'tel' },
              { id: 'date', label: 'Service Date', type: 'date' },
              { id: 'time', label: 'Service Time', type: 'time' }
            ].map(({ id, label, type }) => (
              <div className="mb-4" key={id}>
                <label htmlFor={id} className="block text-sm font-medium text-gray-700">{label}</label>
                <input
                  type={type}
                  id={id}
                  name={id}
                  value={formData[id]}
                  onChange={handleChange}
                  className="mt-1 p-3 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                />
                {errors[id] && <p className="text-red-600 text-sm">{errors[id]}</p>}
              </div>
            ))}

            {/* Service type dropdown */}
            <div className="mb-4">
              <label htmlFor="serviceType" className="block text-sm font-medium text-gray-700">Type of Security</label>
              <select
                id="serviceType"
                name="serviceType"
                value={formData.serviceType}
                onChange={handleChange}
                className="mt-1 p-3 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">-- Select Service --</option>
                <option value="nightGuard">Night Guard</option>
                <option value="dayGuard">Day Guard</option>
                <option value="24x7">24/7 Surveillance</option>
                <option value="gateSecurity">Gate Security</option>
                <option value="eventSecurity">Event Security</option>
              </select>
              {errors.serviceType && <p className="text-red-600 text-sm">{errors.serviceType}</p>}
            </div>

            {/* Number of guards */}
            <div className="mb-4">
              <label htmlFor="numberOfGuards" className="block text-sm font-medium text-gray-700">Number of Guards</label>
              <select
                id="numberOfGuards"
                name="numberOfGuards"
                value={formData.numberOfGuards}
                onChange={handleChange}
                className="mt-1 p-3 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              >
                {[...Array(10).keys()].map((num) => (
                  <option key={num + 1} value={num + 1}>
                    {num + 1}
                  </option>
                ))}
              </select>
              {errors.numberOfGuards && <p className="text-red-600 text-sm">{errors.numberOfGuards}</p>}
            </div>

            {/* Notes */}
            <div className="mb-4">
              <label htmlFor="additionalNotes" className="block text-sm font-medium text-gray-700">Additional Notes</label>
              <textarea
                id="additionalNotes"
                name="additionalNotes"
                value={formData.additionalNotes}
                onChange={handleChange}
                rows="4"
                className="mt-1 p-3 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <p className="text-orange-600 text-sm mt-2">
              Our professional guards will ensure safety and peace of mind for your premises.
            </p>

            <button
              type="submit"
              className="w-full py-3 bg-indigo-500 text-white text-lg font-medium rounded-lg hover:bg-indigo-600 transition duration-300 focus:outline-none focus:ring-4 focus:ring-indigo-300"
            >
              Submit Security Request
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default SecurityForm;
