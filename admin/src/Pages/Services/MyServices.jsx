import React, { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { AuthContext } from '../../context/AuthContext';
import axios from 'axios';

const MyServices = () => {
  const [services, setServices] = useState([]);
  const [editingService, setEditingService] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [searchQuery, setSearchQuery] = useState('');
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const { backendUrl } = useContext(AuthContext);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const { data } = await axios.get(`${backendUrl}/api/cleaningservice/all-services`, {
          withCredentials: true,
        });
        setServices(data.allServices);
      } catch (error) {
        setErrors({ fetch: error.response?.data?.message || 'Failed to load services' });
      }
    };
    fetchServices();
  }, [backendUrl]);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${backendUrl}/api/cleaningservice/delete-service/${id}`, {
        withCredentials: true,
      });
      setServices((prev) => prev.filter((service) => service._id !== id));
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to delete service');
    }
  };

  const handleEdit = (service) => {
    setEditingService(service._id);
    setEditForm({ ...service });
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
        `${backendUrl}/api/cleaningservice/update-service/${editingService}`,
        editForm,
        { withCredentials: true }
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

    const tableColumn = ["Owner ID", "Name", "Email", "Phone", "Type", "Staff", "Notes", "Date", "Time", "State"];
    const tableRows = [];

    filteredServices.forEach((service) => {
      tableRows.push([
        service.ownerId,
        service.name,
        service.email,
        service.phoneNumber,
        service.serviceType,
        service.numberOfStaff,
        service.additionalNotes,
        service.date,
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
    service.ownerId.toLowerCase().includes(searchQuery.toLowerCase()) ||
    service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    service.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    service.phoneNumber.includes(searchQuery)
  );

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
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 z-10 w-3/4 bg-white p-6 rounded-xl shadow-lg border border-gray-300">
          <h2 className="text-2xl font-semibold text-blue-700 mb-4">Edit Service Request</h2>
          <div className="space-y-4">
            {Object.keys(editForm).map((key) => {
              if (key === '_id' || key === '__v') return null;
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
                  {key === 'additionalNotes' ? (
                    <textarea
                      name={key}
                      value={editForm[key]}
                      onChange={handleEditChange}
                      className="p-2 border rounded-lg"
                      rows="3"
                    />
                  ) : (
                    <input
                      type={key === 'date' ? 'date' : key === 'time' ? 'time' : 'text'}
                      name={key}
                      value={editForm[key]}
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
      )}

      {filteredServices.length > 0 ? (
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
              {filteredServices.map((service) => (
                <tr key={service._id} className="hover:bg-gray-100 transition duration-200">
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
                        onClick={() => handleEdit(service)} // ✅ Fixed line
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
