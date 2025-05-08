import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const EditOwner = () => {
  const [owners, setOwners] = useState([]);
  const [selectedOwners, setSelectedOwners] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const ownersPerPage = 10;
  
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOwnersData = async () => {
      try {
        const response = await fetch('http://localhost:8001/api/owners');
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        
        const data = await response.json();
        if (data.success) {
          setOwners(data.owners);
        } else {
          throw new Error(data.message || 'Failed to fetch owners data');
        }
      } catch (error) {
        console.error('Error fetching owner data:', error);
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOwnersData();
  }, []);

  // Filter owners based on search term
  const filteredOwners = owners.filter(owner => 
    `${owner.firstName} ${owner.lastName}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination logic
  const indexOfLastOwner = currentPage * ownersPerPage;
  const indexOfFirstOwner = indexOfLastOwner - ownersPerPage;
  const currentOwners = filteredOwners.slice(indexOfFirstOwner, indexOfLastOwner);
  const totalPages = Math.ceil(filteredOwners.length / ownersPerPage);

  const handleCheckboxChange = (ownerId) => {
    setSelectedOwners(prev => 
      prev.includes(ownerId) 
        ? prev.filter(id => id !== ownerId) 
        : [...prev, ownerId]
    );
  };

  const handleEdit = (owner) => {
    navigate(`/edit-owner/${owner.id}`, { state: { owner } });
  };

  // Simple date formatter
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (isLoading) return <div className="p-6 text-center">Loading owner data...</div>;
  if (error) return <div className="p-6 text-center text-red-500">Error: {error}</div>;

  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      {/* Sidebar */}
      <div className="w-full md:w-64 bg-gray-800 text-white p-4">
        <h1 className="text-xl font-bold mb-6">Admin Dashboard</h1>
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-2">Dashboard</h2>
          <ul className="space-y-2">
            <li><Link to="/digital-voting" className="block hover:bg-gray-700 p-2 rounded">Digital Voting</Link></li>
            <li><Link to="/available-homes" className="block hover:bg-gray-700 p-2 rounded">Available Home</Link></li>
            <li><Link to="/owners" className="block hover:bg-gray-700 p-2 rounded">Owner</Link></li>
            <li><Link to="/add-owner" className="block hover:bg-gray-700 p-2 rounded">Add Owner</Link></li>
            <li><Link to="/edit-owner" className="block bg-gray-700 p-2 rounded">Edit Owner</Link></li>
          </ul>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-4 md:p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Owner Management</h1>
        
        <div className="mb-4">
          <input
            type="text"
            placeholder="Search owners..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="p-2 border rounded w-full md:w-1/2"
          />
        </div>

        <div className="bg-white rounded-lg shadow-md p-4">
          {currentOwners.length > 0 ? (
            <>
              {currentOwners.map(owner => (
                <div key={owner.id} className="flex items-center justify-between p-3 border-b last:border-b-0">
                  <div className="flex items-center space-x-4">
                    <input
                      type="checkbox"
                      checked={selectedOwners.includes(owner.id)}
                      onChange={() => handleCheckboxChange(owner.id)}
                      className="h-5 w-5 text-blue-600 rounded"
                    />
                    <div>
                      <span className="font-medium block">{owner.firstName} {owner.lastName}</span>
                      <span className="text-sm text-gray-500">
                        Residence: {owner.residenceNum} | Members: {owner.memberCount}
                      </span>
                      <span className="text-sm text-gray-500 block">
                        Dates: {formatDate(owner.startDate)} - {formatDate(owner.endDate)}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleEdit(owner)}
                    aria-label={`Edit ${owner.firstName} ${owner.lastName}`}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                  >
                    Edit
                  </button>
                </div>
              ))}

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center mt-4">
                  <button
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="mx-1 px-3 py-1 rounded bg-gray-200 disabled:opacity-50"
                  >
                    Previous
                  </button>
                  
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }
                    
                    return (
                      <button
                        key={pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                        className={`mx-1 px-3 py-1 rounded ${currentPage === pageNum ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}

                  <button
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="mx-1 px-3 py-1 rounded bg-gray-200 disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center p-6">
              <p className="text-gray-500 mb-4">No owners found</p>
              <Link 
                to="/add-owner" 
                className="inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
              >
                Add New Owner
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EditOwner;