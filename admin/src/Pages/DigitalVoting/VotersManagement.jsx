import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import jsPDF from 'jspdf';
import 'jspdf-autotable';  // Ensure this is imported


// Modal Component for Confirmation
const Modal = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null;



  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-sm w-full">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Confirm Deletion</h2>
        <p className="text-gray-600 mb-4">Are you sure you want to delete this voter?</p>
        <div className="flex justify-end space-x-4">
          <button onClick={onClose} className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors">Cancel</button>
          <button
            onClick={() => { onConfirm(); onClose(); }}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

const VotersManagement = () => {
  const [voters, setVoters] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [voterToDelete, setVoterToDelete] = useState(null);
  const [pdfGenerating, setPdfGenerating] = useState(false);

  const tableRef = useRef(null);

  useEffect(() => {
    const fetchVoters = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(`http://localhost:8001/api/voters?page=${page}&limit=10`);
        setVoters(response.data.voters);
        setTotalPages(response.data.totalPages);
        setIsLoading(false);
      } catch {
          setError('Failed to load voters data. Please try again later.');
          setIsLoading(false);
        }
    };

    fetchVoters();
  }, [page]);

  const handleVerificationStatus = async (voterId, isVerified) => {
    try {
      const verificationDate = isVerified ? new Date().toISOString() : null;
      await axios.patch(`http://localhost:8001/api/voters/${voterId}`, {
        verified: isVerified,
        verificationDate: verificationDate,
      });

      setVoters(prevVoters =>
        prevVoters.map(voter =>
          voter._id === voterId ? { ...voter, verified: isVerified, verificationDate: verificationDate } : voter
        )
      );
    } catch {
      alert('Failed to update verification status. Please try again.');
    }
  };

  const handleDeleteVoter = (voterId) => {
    setVoterToDelete(voterId);
    setIsModalOpen(true);
  };

  const confirmDelete = async () => {
    try {
      await axios.delete(`http://localhost:8001/api/voters/${voterToDelete}`);
      setVoters(voters.filter(voter => voter._id !== voterToDelete)); // Remove deleted voter from the list
    } catch {
      alert('Failed to delete voter. Please try again.');
    }
  };

  const filteredVoters = voters.filter(voter => {
    const matchesSearch =
      voter.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      voter.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      voter.houseId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      voter.voterId?.toLowerCase().includes(searchTerm.toLowerCase());

    if (filter === 'all') return matchesSearch;
    if (filter === 'verified') return matchesSearch && voter.verified;
    if (filter === 'unverified') return matchesSearch && !voter.verified;
    return matchesSearch;
  });

  const paginatedVoters = filteredVoters.slice((page - 1) * 10, page * 10);

  const handlePreviousPage = () => {
    if (page > 1) setPage(page - 1);
  };

  const handleNextPage = () => {
    if (page < totalPages) setPage(page + 1);
  };

  // Fixed PDF Generation Function
  const generatePDF = () => {
    setPdfGenerating(true);
  
    try {
      // Initialize jsPDF
      const doc = new jsPDF('landscape');
  
      // Add title
      doc.setFontSize(18);
      doc.setTextColor(44, 62, 80);
      doc.text('Voters Management Report', 14, 22);
  
      // Add date
      doc.setFontSize(11);
      doc.setTextColor(100, 100, 100);
      doc.text(`Generated on: ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}`, 14, 30);
  
      // Add filter info
      let filterText = 'All Voters';
      if (filter === 'verified') filterText = 'Verified Voters';
      if (filter === 'unverified') filterText = 'Pending Voters';
      if (searchTerm) filterText += ` (Search: "${searchTerm}")`;
      doc.text(filterText, 14, 38);
  
      // Define the columns
      const tableColumn = [
        "ID", 
        "Name", 
        "House ID", 
        "Status", 
        "Registration Date", 
        "Verification Date"
      ];
  
      // Define the rows
      const tableRows = [];
  
      // For all filtered voters (not just current page)
      filteredVoters.forEach(voter => {
        const voterData = [
          voter.voterId || '',
          voter.name || '',
          voter.houseId || '',
          voter.verified ? 'Verified' : 'Pending',
          voter.registrationDate ? new Date(voter.registrationDate).toLocaleDateString() : '',
          voter.verificationDate ? new Date(voter.verificationDate).toLocaleDateString() : 'Not Verified'
        ];
        tableRows.push(voterData);
      });
  
      // Generate the PDF table using autoTable
      doc.autoTable({
        head: [tableColumn],
        body: tableRows,
        startY: 45,
        styles: {
          fontSize: 10,
          cellPadding: 3,
          lineColor: [44, 62, 80],
          lineWidth: 0.1,
        },
        headStyles: {
          fillColor: [41, 128, 185],
          textColor: 255,
          fontStyle: 'bold',
        },
        alternateRowStyles: {
          fillColor: [240, 240, 240]
        },
        columnStyles: {
          0: { cellWidth: 30 },
          1: { cellWidth: 'auto' },
          2: { cellWidth: 30 },
          3: { cellWidth: 30 },
          4: { cellWidth: 30 },
          5: { cellWidth: 30 }
        },
      });
  
      // Add summary at the bottom
      const finalY = doc.previousAutoTable.finalY + 10;
      doc.text(`Total Voters: ${filteredVoters.length}`, 14, finalY);
      doc.text(`Verified Voters: ${filteredVoters.filter(v => v.verified).length}`, 14, finalY + 7);
      doc.text(`Pending Voters: ${filteredVoters.filter(v => !v.verified).length}`, 14, finalY + 14);
  
      // Save the PDF
      doc.save(`Voters_Report_${new Date().toISOString().split('T')[0]}.pdf`);
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("Failed to generate PDF. Please try again.");
    } finally {
      setPdfGenerating(false);
    }
  };

const doc = new jsPDF();
console.log(doc.autoTable); 
  

  return (
    <div className="bg-gray-50 min-h-screen p-4">
      <div className="max-w-7xl mx-auto">
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-t-xl shadow-md">
          <div className="px-6 py-8 md:flex md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white">Voters Management</h1>
              <p className="mt-2 text-blue-100">Manage and verify registered voters</p>
            </div>
            <div className="mt-4 md:mt-0">
              <button 
                onClick={generatePDF}
                disabled={pdfGenerating || isLoading || filteredVoters.length === 0}
                className={`
                  flex items-center px-4 py-2 bg-white text-blue-700 rounded-md shadow-sm
                  ${(pdfGenerating || isLoading || filteredVoters.length === 0) ? 
                    'opacity-50 cursor-not-allowed' : 
                    'hover:bg-blue-50'
                  }
                `}
              >
                {pdfGenerating ? (
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-blue-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : (
                  <svg className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                )}
                {pdfGenerating ? 'Generating PDF...' : 'Export to PDF'}
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-b-xl shadow-md overflow-hidden">
          <div className="px-6 py-6">
            {/* Search and Filter Section */}
            <div className="md:flex md:items-center md:justify-between mb-6">
              <div className="md:w-1/2 mb-4 md:mb-0">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Search by name, email, ID, or house ID"
                  />
                </div>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => setFilter('all')}
                  className={`px-4 py-2 rounded-md ${filter === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                >
                  All
                </button>
                <button
                  onClick={() => setFilter('verified')}
                  className={`px-4 py-2 rounded-md ${filter === 'verified' ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                >
                  Verified
                </button>
                <button
                  onClick={() => setFilter('unverified')}
                  className={`px-4 py-2 rounded-md ${filter === 'unverified' ? 'bg-yellow-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                >
                  Pending
                </button>
              </div>
            </div>
            
            {/* Results Summary */}
            <div className="mb-4 text-gray-600">
              {!isLoading && (
                <p>Showing {filteredVoters.length > 0 ? (page - 1) * 10 + 1 : 0} - {Math.min(page * 10, filteredVoters.length)} of {filteredVoters.length} voters</p>
              )}
            </div>

            {isLoading ? (
              <div className="p-20 flex justify-center">
                <svg
                  className="animate-spin h-10 w-10 text-blue-600"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              </div>
            ) : error ? (
              <div className="p-8 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 mb-4">
                  <svg className="h-8 w-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <p className="text-xl font-medium text-gray-900">{error}</p>
                <p className="mt-2 text-gray-500">Please try refreshing the page</p>
              </div>
            ) : filteredVoters.length === 0 ? (
              <div className="p-8 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 mb-4">
                  <svg className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </div>
                <p className="text-xl font-medium text-gray-900">No results found</p>
                <p className="mt-2 text-gray-500">Try adjusting your search or filter criteria</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table ref={tableRef} className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Voter ID</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Voter</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">House ID</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Photo</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Registration</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Verification</th>
                      <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {paginatedVoters.map((voter) => (
                      <tr key={voter._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{voter.voterId}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{voter.name}</div>
                          {voter.email && <div className="text-sm text-gray-500">{voter.email}</div>}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{voter.houseId}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {voter.photo ? (
                            <img
                              src={`http://localhost:8001/${voter.photo}`}
                              alt="Voter"
                              className="w-12 h-12 rounded-full object-cover border-2 border-gray-200"
                            />
                          ) : (
                            <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
                              <svg className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                              </svg>
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              voter.verified ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                            }`}
                          >
                            {voter.verified ? 'Verified' : 'Pending'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {voter.registrationDate ? new Date(voter.registrationDate).toLocaleDateString() : ''}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {voter.verificationDate ? new Date(voter.verificationDate).toLocaleDateString() : 'Not Verified'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex justify-center space-x-2">
                            <button
                              onClick={() => handleVerificationStatus(voter._id, !voter.verified)}
                              disabled={voter.verified}
                              className={`px-3 py-1 rounded ${
                                voter.verified
                                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                  : 'bg-green-50 text-green-700 hover:bg-green-100'
                              }`}
                            >
                              Verify
                            </button>
                            <button
                              onClick={() => handleVerificationStatus(voter._id, false)}
                              disabled={!voter.verified}
                              className={`px-3 py-1 rounded ${
                                !voter.verified
                                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                  : 'bg-yellow-50 text-yellow-700 hover:bg-yellow-100'
                              }`}
                            >
                              Unverify
                            </button>
                            <button
                              onClick={() => handleDeleteVoter(voter._id)}
                              className="px-3 py-1 bg-red-50 text-red-700 hover:bg-red-100 rounded"
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
            )}

            {/* Pagination */}
            {!isLoading && filteredVoters.length > 0 && (
              <div className="flex items-center justify-between px-4 py-6 sm:px-6">
                <div className="flex flex-1 justify-between sm:hidden">
                  <button
                    onClick={handlePreviousPage}
                    disabled={page === 1}
                    className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
                      page === 1 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    Previous
                  </button>
                  <button
                    onClick={handleNextPage}
                    disabled={page >= totalPages}
                    className={`ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
                      page >= totalPages ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    Next
                  </button>
                </div>
                <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm text-gray-700">
                      Showing <span className="font-medium">{filteredVoters.length > 0 ? (page - 1) * 10 + 1 : 0}</span> to{' '}
                      <span className="font-medium">{Math.min(page * 10, filteredVoters.length)}</span> of{' '}
                      <span className="font-medium">{filteredVoters.length}</span> results
                    </p>
                  </div>
                  <div>
                    <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                      <button
                        onClick={handlePreviousPage}
                        disabled={page === 1}
                        className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium ${
                          page === 1 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500 hover:bg-gray-50'
                        }`}
                      >
                        <span className="sr-only">Previous</span>
                        <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                          <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </button>
                      
                      {[...Array(totalPages).keys()].map((x) => (
                        <button
                          key={x + 1}
                          onClick={() => setPage(x + 1)}
                          className={`relative inline-flex items-center px-4 py-2 border ${
                            page === x + 1
                              ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                              : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                          } text-sm font-medium`}
                        >
                          {x + 1}
                        </button>
                      ))}
    
                      <button
                        onClick={handleNextPage}
                        disabled={page >= totalPages}
                        className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium ${
                          page >= totalPages ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500 hover:bg-gray-50'
                        }`}
                      >
                        <span className="sr-only">Next</span>
                        <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                          <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </nav>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal Component */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onConfirm={confirmDelete} />
    </div>
  );
};

export default VotersManagement;
