import React, { useState, useEffect } from 'react';
import { FaEye, FaEdit, FaTrash, FaSearch, FaUserPlus, FaSort, FaSpinner } from 'react-icons/fa';
import { Link } from 'react-router-dom';

// API base URL - you can move this to an environment variable or config file
const API_BASE_URL = 'http://localhost:8001/api';

const ManageHomeOwner = () => {
  const [owners, setOwners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState('createdAt');
  const [sortDirection, setSortDirection] = useState('desc');
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [detailsModal, setDetailsModal] = useState(null);
  const ownersPerPage = 10;

  // Fetch all owners from the API
  useEffect(() => {
    fetchOwners();
  }, []);

  const fetchOwners = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/homeowner/owners`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.success) {
        // The API now returns owners in data.owners instead of data.data
        setOwners(data.owners || []);
      } else {
        throw new Error(data.error || 'Failed to fetch owners');
      }
    } catch (err) {
      console.error('Error fetching owners:', err);
      setError(err.message || 'Failed to fetch owners');
    } finally {
      setLoading(false);
    }
  };

  // Handle owner deletion
  const handleDelete = async (id) => {
    if (confirmDelete !== id) {
      setConfirmDelete(id);
      return;
    }
    
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/homeowner/owners/${id}`, {
        method: 'DELETE'
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.success) {
        // Remove the deleted owner from the state
        setOwners(owners.filter(owner => owner._id !== id));
        setConfirmDelete(null);
      } else {
        throw new Error(data.error || 'Failed to delete owner');
      }
    } catch (err) {
      console.error('Error deleting owner:', err);
      alert(`Error deleting owner: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Handle sorting
  const handleSort = (field) => {
    if (sortField === field) {
      // If already sorting by this field, toggle direction
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      // New field, default to ascending
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Filter owners based on search term
  const filteredOwners = owners.filter(owner => {
    const searchFields = [
      owner.firstName,
      owner.lastName,
      owner.residenceNum,
      owner.age?.toString(),
      owner.memberCount?.toString()
    ];
    
    const searchString = searchFields.filter(Boolean).join(' ').toLowerCase();
    return searchString.includes(searchTerm.toLowerCase());
  });

  // Sort owners
  const sortedOwners = [...filteredOwners].sort((a, b) => {
    let aValue = a[sortField];
    let bValue = b[sortField];
    
    // Handle null/undefined values
    if (aValue === undefined || aValue === null) aValue = sortDirection === 'asc' ? '' : 'zzz';
    if (bValue === undefined || bValue === null) bValue = sortDirection === 'asc' ? '' : 'zzz';
    
    // Handle dates
    if (sortField === 'startDate' || sortField === 'endDate' || sortField === 'createdAt') {
      aValue = new Date(aValue || 0);
      bValue = new Date(bValue || 0);
    }
    
    // Handle strings
    if (typeof aValue === 'string' && typeof bValue === 'string') {
      return sortDirection === 'asc' 
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    }
    
    // Handle numbers and dates
    return sortDirection === 'asc' ? (aValue - bValue) : (bValue - aValue);
  });

  // Pagination
  const indexOfLastOwner = currentPage * ownersPerPage;
  const indexOfFirstOwner = indexOfLastOwner - ownersPerPage;
  const currentOwners = sortedOwners.slice(indexOfFirstOwner, indexOfLastOwner);
  const totalPages = Math.ceil(sortedOwners.length / ownersPerPage);

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString();
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Invalid Date';
    }
  };

  // View owner details modal
  const OwnerDetailsModal = ({ owner, onClose }) => {
    if (!owner) return null;
    
    return (
      <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          <div className="sticky top-0 bg-blue-600 text-white px-6 py-4 flex justify-between items-center rounded-t-lg">
            <h3 className="text-xl font-bold">Owner Details</h3>
            <button onClick={onClose} className="text-white hover:text-gray-200">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="col-span-full flex flex-col sm:flex-row gap-6 border-b pb-6">
              <div className="flex-shrink-0">
                {owner.profilePhotoUrl ? (
                  <img 
                    src={owner.profilePhotoUrl} 
                    alt={`${owner.firstName} ${owner.lastName}`}
                    className="w-40 h-40 object-cover rounded-lg shadow"
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/150?text=No+Photo';
                    }}
                  />
                ) : (
                  <div className="w-40 h-40 bg-gray-200 rounded-lg shadow flex items-center justify-center">
                    <span className="text-4xl font-bold text-gray-400">
                      {owner.firstName?.charAt(0) || ''}
                      {owner.lastName?.charAt(0) || ''}
                    </span>
                  </div>
                )}
              </div>
              
              <div className="flex flex-col justify-center">
                <h2 className="text-2xl font-bold text-gray-800">
                  {owner.firstName} {owner.lastName}
                </h2>
                <p className="text-gray-600">Residence: {owner.residenceNum}</p>
                <p className="text-gray-600">Age: {owner.age}</p>
                <p className="text-gray-600">Household Members: {owner.memberCount}</p>
                {owner.email && <p className="text-gray-600">Email: {owner.email}</p>}
                {owner.phone && <p className="text-gray-600">Phone: {owner.phone}</p>}
              </div>
            </div>
            
            <div className="space-y-4">
              <h4 className="font-semibold text-gray-700">Residence Information</h4>
              <div className="grid grid-cols-2 gap-2">
                <div className="text-gray-500">Start Date:</div>
                <div>{formatDate(owner.startDate)}</div>
                
                <div className="text-gray-500">End Date:</div>
                <div>{formatDate(owner.endDate)}</div>
                
                <div className="text-gray-500">Registration Date:</div>
                <div>{formatDate(owner.createdAt)}</div>
                
                {owner.address && (
                  <>
                    <div className="text-gray-500">Address:</div>
                    <div>{owner.address}</div>
                  </>
                )}
                
                {owner.apartmentNumber && (
                  <>
                    <div className="text-gray-500">Apartment Number:</div>
                    <div>{owner.apartmentNumber}</div>
                  </>
                )}
              </div>
            </div>
            
            <div className="space-y-4">
              <h4 className="font-semibold text-gray-700">Document Verification</h4>
              <div className="flex flex-wrap gap-4">
                {owner.nicFrontUrl ? (
                  <div className="text-center">
                    <img 
                      src={owner.nicFrontUrl} 
                      alt="NIC Front"
                      className="w-32 h-24 object-cover rounded border border-gray-300"
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/150x100?text=No+Image';
                      }}
                    />
                    <p className="text-sm text-gray-500 mt-1">NIC Front</p>
                  </div>
                ) : (
                  <div className="text-center">
                    <div className="w-32 h-24 bg-gray-200 rounded border border-gray-300 flex items-center justify-center">
                      <span className="text-xs text-gray-500">No Image</span>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">NIC Front</p>
                  </div>
                )}
                
                {owner.nicBackUrl ? (
                  <div className="text-center">
                    <img 
                      src={owner.nicBackUrl}
                      alt="NIC Back"
                      className="w-32 h-24 object-cover rounded border border-gray-300"
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/150x100?text=No+Image';
                      }}
                    />
                    <p className="text-sm text-gray-500 mt-1">NIC Back</p>
                  </div>
                ) : (
                  <div className="text-center">
                    <div className="w-32 h-24 bg-gray-200 rounded border border-gray-300 flex items-center justify-center">
                      <span className="text-xs text-gray-500">No Image</span>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">NIC Back</p>
                  </div>
                )}
              </div>
            </div>
            
            <div className="col-span-full border-t pt-4 mt-2">
              <h4 className="font-semibold text-gray-700 mb-2">Signature</h4>
              {owner.signatureUrl ? (
                <img 
                  src={owner.signatureUrl} 
                  alt="Signature"
                  className="max-h-20 border border-gray-300 rounded p-2 bg-gray-50"
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/300x100?text=No+Signature';
                  }}
                />
              ) : (
                <div className="h-20 border border-gray-300 rounded p-2 bg-gray-50 flex items-center justify-center">
                  <span className="text-gray-500">No signature available</span>
                </div>
              )}
            </div>
            
            {owner.notes && (
              <div className="col-span-full border-t pt-4 mt-2">
                <h4 className="font-semibold text-gray-700 mb-2">Notes</h4>
                <p className="text-gray-600 whitespace-pre-line">{owner.notes}</p>
              </div>
            )}
          </div>
          
          <div className="px-6 py-4 bg-gray-50 rounded-b-lg flex justify-end space-x-2">
            <Link 
              to={`/edit-owner/${owner._id}`} 
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              <FaEdit className="inline mr-1" /> Edit
            </Link>
            <button 
              onClick={() => {
                onClose();
                setConfirmDelete(owner._id);
              }}
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            >
              <FaTrash className="inline mr-1" /> Delete
            </button>
            <button 
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <h1 className="text-2xl font-bold text-blue-700 flex items-center">
            <span className="mr-2">🏢</span> Manage Apartment Owners
          </h1>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative">
              <input
                type="text"
                placeholder="Search owners..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-full focus:ring focus:ring-blue-300"
              />
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
            
            <Link 
              to="/add-owner" 
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center justify-center"
            >
              <FaUserPlus className="mr-2" /> Add New Owner
            </Link>
          </div>
        </div>
        
        {loading && owners.length === 0 ? (
          <div className="flex justify-center items-center h-48">
            <FaSpinner className="animate-spin text-blue-500 text-4xl" />
          </div>
        ) : error ? (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            <p className="font-medium">Error: {error}</p>
          </div>
        ) : sortedOwners.length === 0 ? (
          <div className="text-center py-10">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="mt-2 text-lg font-medium text-gray-900">No owners found</h3>
            <p className="mt-1 text-gray-500">
              {searchTerm ? `No results for "${searchTerm}"` : 'Start by adding your first apartment owner.'}
            </p>
            {searchTerm && (
              <button 
                onClick={() => setSearchTerm('')}
                className="mt-2 text-blue-600 hover:text-blue-800"
              >
                Clear search
              </button>
            )}
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border border-gray-200 rounded-lg">
                <thead className="bg-gray-50">
                  <tr>
                    <th 
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                      onClick={() => handleSort('firstName')}
                    >
                      <div className="flex items-center">
                        Name
                        {sortField === 'firstName' && (
                          <FaSort className="ml-1 text-blue-500" />
                        )}
                      </div>
                    </th>
                    <th 
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                      onClick={() => handleSort('residenceNum')}
                    >
                      <div className="flex items-center">
                        Residence No.
                        {sortField === 'residenceNum' && (
                          <FaSort className="ml-1 text-blue-500" />
                        )}
                      </div>
                    </th>
                    <th 
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                      onClick={() => handleSort('memberCount')}
                    >
                      <div className="flex items-center">
                        Members
                        {sortField === 'memberCount' && (
                          <FaSort className="ml-1 text-blue-500" />
                        )}
                      </div>
                    </th>
                    <th 
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                      onClick={() => handleSort('startDate')}
                    >
                      <div className="flex items-center">
                        Start Date
                        {sortField === 'startDate' && (
                          <FaSort className="ml-1 text-blue-500" />
                        )}
                      </div>
                    </th>
                    <th 
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                      onClick={() => handleSort('endDate')}
                    >
                      <div className="flex items-center">
                        End Date
                        {sortField === 'endDate' && (
                          <FaSort className="ml-1 text-blue-500" />
                        )}
                      </div>
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {currentOwners.map((owner) => (
                    <tr key={owner._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {owner.profilePhotoUrl ? (
                            <img 
                              src={owner.profilePhotoUrl}
                              alt={`${owner.firstName} ${owner.lastName}`}
                              className="h-10 w-10 rounded-full object-cover mr-3"
                              onError={(e) => {
                                e.target.src = 'https://via.placeholder.com/40?text=?';
                              }}
                            />
                          ) : (
                            <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                              <span className="text-blue-500 font-medium">
                                {owner.firstName?.charAt(0) || '?'}
                              </span>
                            </div>
                          )}
                          <div>
                            <div className="font-medium text-gray-900">
                              {owner.firstName} {owner.lastName}
                            </div>
                            <div className="text-sm text-gray-500">
                              Age: {owner.age || 'N/A'}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {owner.residenceNum || 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {owner.memberCount || '0'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(owner.startDate)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(owner.endDate)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                        <button
                          onClick={() => setDetailsModal(owner)}
                          className="text-blue-600 hover:text-blue-900"
                          title="View Details"
                        >
                          <FaEye className="inline" />
                        </button>
                        <Link
                          to={`/edit-owner/${owner._id}`}
                          className="text-indigo-600 hover:text-indigo-900 ml-3"
                          title="Edit Owner"
                        >
                          <FaEdit className="inline" />
                        </Link>
                        <button
                          onClick={() => handleDelete(owner._id)}
                          className={`${
                            confirmDelete === owner._id 
                              ? 'text-red-500 font-bold' 
                              : 'text-red-600 hover:text-red-900'
                          } ml-3`}
                          title={confirmDelete === owner._id ? 'Click again to confirm' : 'Delete Owner'}
                        >
                          <FaTrash className="inline" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-between items-center mt-6">
                <div className="text-sm text-gray-500">
                  Showing {indexOfFirstOwner + 1} to {Math.min(indexOfLastOwner, sortedOwners.length)} of {sortedOwners.length} owners
                </div>
                <div className="flex space-x-1">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className={`px-3 py-1 rounded ${
                      currentPage === 1 
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    Previous
                  </button>
                  
                  {Array.from({ length: totalPages }, (_, i) => i + 1)
                    .filter(page => {
                      // Show only a few pages around the current page
                      return (
                        page === 1 || 
                        page === totalPages || 
                        (page >= currentPage - 1 && page <= currentPage + 1)
                      );
                    })
                    .map((page, index, array) => {
                      // Add ellipsis if there are gaps
                      const showEllipsisAfter = index < array.length - 1 && array[index + 1] - page > 1;
                      const showEllipsisBefore = index > 0 && page - array[index - 1] > 1;
                      
                      return (
                        <React.Fragment key={page}>
                          {showEllipsisBefore && (
                            <span className="px-3 py-1 rounded bg-gray-100 text-gray-700">...</span>
                          )}
                          
                          <button
                            onClick={() => setCurrentPage(page)}
                            className={`px-3 py-1 rounded ${
                              currentPage === page 
                                ? 'bg-blue-500 text-white' 
                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                            }`}
                          >
                            {page}
                          </button>
                          
                          {showEllipsisAfter && (
                            <span className="px-3 py-1 rounded bg-gray-100 text-gray-700">...</span>
                          )}
                        </React.Fragment>
                      );
                    })}
                  
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className={`px-3 py-1 rounded ${
                      currentPage === totalPages 
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
      
      {/* Details Modal */}
      {detailsModal && (
        <OwnerDetailsModal 
          owner={detailsModal} 
          onClose={() => setDetailsModal(null)} 
        />
      )}
    </div>
  );
};

export default ManageHomeOwner;