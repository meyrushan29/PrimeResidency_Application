import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const initialData = [
  {
    id: 1,
    ownerId: 'Ow1234',
    name: 'jos',
    email: 'jos@example.com',
    phoneNumber: '0772844991',
    serviceType: 'Daily',
    numberOfStaff: 2,
    additionalNotes: 'clean',
    date: '2025-03-30',
    time: '10:00',
    state: 'Pending', // Initial state filled
  },
  {
    id: 2,
    ownerId: 'Ow5678',
    name: 'Jane Smith',
    email: 'jane@example.com',
    phoneNumber: '0987654321',
    serviceType: 'Weekly',
    numberOfStaff: 3,
    additionalNotes: 'Include parking area',
    date: '2025-04-01',
    time: '14:30',
    state: 'Approved', // Initial state filled
  },
  {
    id: 3,
    ownerId: 'Ow4321',
    name: 'Alex Johnson',
    email: 'alex@example.com',
    phoneNumber: '1231231234',
    serviceType: 'Daily',
    numberOfStaff: 1,
    additionalNotes: 'Use eco-friendly products',
    date: '2025-04-02',
    time: '09:00',
    state: 'Rejected', // Initial state filled
  },
];

const VerifyServices = () => {
  const [services, setServices] = useState(initialData);
  const [editingService, setEditingService] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [searchQuery, setSearchQuery] = useState('');
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleDelete = (id) => {
    setServices(services.filter(service => service.id !== id));
  };

  const handleEdit = (service) => {
    setEditingService(service.id);
    setEditForm({ ...service });
    setErrors({});
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm({ ...editForm, [name]: value });
  };

  const handleUpdate = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const ownerIdRegex = /^Ow\d{4}$/;

    if (!emailRegex.test(editForm.email)) {
      newErrors.email = 'Invalid email format';
    }
    if (!ownerIdRegex.test(editForm.ownerId)) {
      newErrors.ownerId = 'Owner ID must start with "Ow" followed by 4 digits';
    }
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setServices(services.map(service => service.id === editingService ? editForm : service));
    setEditingService(null);
    setErrors({});
  };

  const handleCancelEdit = () => {
    setEditingService(null);
    setErrors({});
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const filteredServices = services.filter(service =>
    service.ownerId.toLowerCase().includes(searchQuery.toLowerCase()) ||
    service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    service.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    service.phoneNumber.includes(searchQuery)
  );

  return (
    <div className="relative p-8 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-semibold text-center text-blue-700 mb-6">Requested Services</h1>

      {/* Search Bar */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search by Owner ID, Name, Email, or Phone"
          value={searchQuery}
          onChange={handleSearch}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Edit Form */}
      {editingService && (
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 z-10 w-3/4 bg-white p-6 rounded-xl shadow-lg border border-gray-300">
          <h2 className="text-2xl font-semibold text-blue-700 mb-4">Edit Service Request</h2>
          <div className="space-y-4">
            {Object.keys(editForm).map((key) => {
              if (key === 'id' || key === 'additionalNotes') return null;
              if (key === 'state') {
                return (
                  <div key={key} className="flex flex-col">
                    <label htmlFor={key} className="font-medium text-gray-700 capitalize">{key}</label>
                    <select
                      name={key}
                      value={editForm[key]}
                      onChange={handleEditChange}
                      className="p-2 border rounded-lg"
                    >
                      <option value="Pending">Pending</option>
                      <option value="Approved">Approved</option>
                      <option value="Rejected">Rejected</option>
                    </select>
                  </div>
                );
              }
              return (
                <div key={key} className="flex flex-col">
                  <label htmlFor={key} className="font-medium text-gray-700 capitalize">{key}</label>
                  <input
                    type={key === 'date' ? 'date' : key === 'time' ? 'time' : 'text'}
                    name={key}
                    value={editForm[key]}
                    onChange={handleEditChange}
                    className="p-2 border rounded-lg"
                  />
                  {errors[key] && <span className="text-red-500 text-sm mt-1">{errors[key]}</span>}
                </div>
              );
            })}
            <div className="flex flex-col">
              <label htmlFor="additionalNotes" className="font-medium text-gray-700">Additional Notes</label>
              <textarea
                name="additionalNotes"
                value={editForm.additionalNotes}
                onChange={handleEditChange}
                className="p-2 border rounded-lg"
                rows="3"
              />
            </div>
            <div className="flex justify-end space-x-3 mt-4">
              <button
                onClick={handleUpdate}
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg"
              >
                Save
              </button>
              <button
                onClick={handleCancelEdit}
                className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded-lg"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Conditional Table or Empty Message */}
      {filteredServices.length > 0 ? (
        <>
          {/* Table */}
          <div className={`overflow-x-auto ${editingService ? 'opacity-30 pointer-events-none' : ''}`}>
            <table className="min-w-full bg-white border border-gray-300 rounded-xl shadow-lg">
              <thead>
                <tr className="bg-blue-100 text-blue-800">
                  <th className="py-3 px-4 border-b">Owner ID</th>
                  <th className="py-3 px-4 border-b">Name</th>
                  <th className="py-3 px-4 border-b">Email</th>
                  <th className="py-3 px-4 border-b">Phone No</th>
                  <th className="py-3 px-4 border-b">Type</th>
                  <th className="py-3 px-4 border-b">Count</th>
                  <th className="py-3 px-4 border-b">Note</th>
                  <th className="py-3 px-4 border-b">Date</th>
                  <th className="py-3 px-4 border-b">Time</th>
                  <th className="py-3 px-4 border-b">State</th>
                  <th className="py-3 px-4 border-b">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredServices.map(service => (
                  <tr key={service.id} className="hover:bg-gray-100 transition duration-200">
                    <td className="py-2 px-4 text-center">{service.ownerId}</td>
                    <td className="py-2 px-4 text-center">{service.name}</td>
                    <td className="py-2 px-4 text-center">{service.email}</td>
                    <td className="py-2 px-4 text-center">{service.phoneNumber}</td>
                    <td className="py-2 px-4 text-center">{service.serviceType}</td>
                    <td className="py-2 px-4 text-center">{service.numberOfStaff}</td>
                    <td className="py-2 px-4 text-center">{service.additionalNotes}</td>
                    <td className="py-2 px-4 text-center">{service.date}</td>
                    <td className="py-2 px-4 text-center">{service.time}</td>
                    <td className="py-2 px-4 text-center">{service.state}</td>
                    <td className="py-2 px-4">
                      <div className="flex justify-center space-x-3">
                        <button
                          onClick={() => handleEdit(service)}
                          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1 rounded-lg text-sm shadow"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(service.id)}
                          className="bg-red-600 hover:bg-red-700 text-white px-4 py-1 rounded-lg text-sm shadow"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      ) : (
        <div className="text-center text-gray-500 text-lg mt-10">
          🚫 No service requests found.
        </div>
      )}
    </div>
  );
};

export default VerifyServices;
