import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import axios from 'axios';

const MyServices = () => {
  const [services, setServices] = useState([]);
  const [editingService, setEditingService] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [searchQuery, setSearchQuery] = useState('');
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const API_URL = 'http://localhost:8001';

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const { data } = await axios.get(`${API_URL}/api/cleaningservice/all-services`);
        setServices(data.allServices);
      } catch (error) {
        console.error('Error fetching services:', error);
        setErrors({ fetch: error.response?.data?.message || 'Failed to load services' });
      }
    };
    fetchServices();
  }, []);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_URL}/api/cleaningservice/delete-service/${id}`);
      setServices((prev) => prev.filter((service) => service._id !== id));
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to delete service');
    }
  };

  const handleEdit = (service) => {
    // Format date for the edit form
    const formattedService = {
      ...service,
      date: service.date ? new Date(service.date).toISOString().split('T')[0] : '',
    };
    
    setEditingService(service._id);
    setEditForm(formattedService);
    setErrors({});
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const ownerIdRegex = /^Ow\d{4}$/;

    if (!emailRegex.test(editForm.email)) newErrors.email = 'Invalid email format';
    if (!ownerIdRegex.test(editForm.ownerId)) newErrors.ownerId = 'Owner ID must be "Ow" followed by 4 digits';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      const { data } = await axios.put(
        `${API_URL}/api/cleaningservice/update-service/${editingService}`,
        editForm
      );
      setServices((prev) =>
        prev.map((service) =>
          service._id === editingService ? { ...data.updatedService } : service
        )
      );
      setEditingService(null);
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to update service');
    }
  };

  const handleCancelEdit = () => {
    setEditingService(null);
    setErrors({});
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    doc.text("Service Requests", 14, 15);

    const tableColumn = ["Owner ID", "Name", "Email", "Phone", "Type", "Staff", "Date", "Time", "State"];
    const tableRows = [];

    filteredServices.forEach((service) => {
      const formattedDate = service.date ? new Date(service.date).toLocaleDateString() : '';
      
      tableRows.push([
        service.ownerId,
        service.name,
        service.email,
        service.phoneNumber,
        service.serviceType,
        service.numberOfStaff,
        formattedDate,
        service.time,
        service.state,
      ]);
    });

    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 20,
      styles: { fontSize: 8 },
    });

    doc.save('service_requests.pdf');
  };

  const filteredServices = services.filter((service) =>
    service.ownerId?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    service.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    service.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    service.phoneNumber?.includes(searchQuery)
  );

  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="relative p-8 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-semibold text-center text-blue-700 mb-6">Requested Services</h1>

      <div className="mb-6 flex justify-between items-center gap-4">
        <input
          type="text"
          placeholder="Search by Owner ID, Name, Email, or Phone"
          value={searchQuery}
          onChange={handleSearch}
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={handleDownloadPDF}
          className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg shadow-md"
        >
          📄 Download PDF
        </button>
      </div>

      {editingService && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-300 w-3/4 max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-semibold text-blue-700 mb-4">Edit Service Request</h2>
            <div className="space-y-4">
              {Object.keys(editForm).map((key) => {
                if (key === '_id' || key === '__v' || key === 'submittedAt') return null;
                
                
                if (key === 'serviceType') {
                  return (
                    <div key={key} className="flex flex-col">
                      <label htmlFor={key} className="font-medium text-gray-700 capitalize">{key}</label>
                      <select
                        name={key}
                        value={editForm[key] || ''}
                        onChange={handleEditChange}
                        className="p-2 border rounded-lg"
                      >
                        <option value="daily">Daily</option>
                        <option value="weekly">Weekly</option>
                        <option value="bi-weekly">Bi-Weekly</option>
                        <option value="monthly">Monthly</option>
                      </select>
                    </div>
                  );
                }
                
                return (
                  <div key={key} className="flex flex-col">
                    <label htmlFor={key} className="font-medium text-gray-700 capitalize">{key}</label>
                    {key === 'additionalNotes' ? (
                      <textarea
                        name={key}
                        value={editForm[key] || ''}
                        onChange={handleEditChange}
                        className="p-2 border rounded-lg"
                        rows="3"
                      />
                    ) : (
                      <input
                        type={key === 'date' ? 'date' : key === 'time' ? 'time' : 'text'}
                        name={key}
                        value={editForm[key] || ''}
                        onChange={handleEditChange}
                        className="p-2 border rounded-lg"
                      />
                    )}
                    {errors[key] && <span className="text-red-500 text-sm mt-1">{errors[key]}</span>}
                  </div>
                );
              })}
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
        </div>
      )}

      {filteredServices.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-300 rounded-xl shadow-lg">
            <thead>
              <tr className="bg-blue-100 text-blue-800">
                <th className="py-3 px-4 border-b">Owner ID</th>
                <th className="py-3 px-4 border-b">Name</th>
                <th className="py-3 px-4 border-b">Email</th>
                <th className="py-3 px-4 border-b">Phone No</th>
                <th className="py-3 px-4 border-b">Type</th>
                <th className="py-3 px-4 border-b">Staff</th>
                <th className="py-3 px-4 border-b">Date</th>
                <th className="py-3 px-4 border-b">Time</th>
                <th className="py-3 px-4 border-b">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredServices.map((service) => (
                <tr key={service._id} className="hover:bg-gray-100 transition duration-200">
                  <td className="py-2 px-4 text-center">{service.ownerId}</td>
                  <td className="py-2 px-4 text-center">{service.name}</td>
                  <td className="py-2 px-4 text-center">{service.email}</td>
                  <td className="py-2 px-4 text-center">{service.phoneNumber}</td>
                  <td className="py-2 px-4 text-center">{service.serviceType}</td>
                  <td className="py-2 px-4 text-center">{service.numberOfStaff}</td>
                  <td className="py-2 px-4 text-center">{formatDate(service.date)}</td>
                  <td className="py-2 px-4 text-center">{service.time}</td>
                  
                  <td className="py-2 px-4">
                    <div className="flex justify-center space-x-3">
                      <button
                        onClick={() => handleEdit(service)}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1 rounded-lg text-sm shadow"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(service._id)}
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
      ) : (
        <div className="text-center text-gray-500 text-lg mt-10">
          🚫 No service requests found.
        </div>
      )}
    </div>
  );
};

export default MyServices;