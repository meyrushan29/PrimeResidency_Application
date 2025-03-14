/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const VotersManagement = () => {
  const [voters, setVoters] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  const [page] = useState(1);
  // eslint-disable-next-line no-unused-vars
  const [totalPages, setTotalPages] = useState(1);
  const [selectedVoter, setSelectedVoter] = useState(null);
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchVoters = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(`http://localhost:8001/api/voters?page=${page}&limit=${itemsPerPage}`);
        console.log(response.data);  // Log response to debug
        setVoters(response.data.voters);
        setTotalPages(response.data.totalPages);
        setIsLoading(false);
      } catch (err) {
        setError('Failed to load voters data. Please try again later.');
        setIsLoading(false);
      }
    };

    fetchVoters();
  }, [page]);

  const handleVerificationStatus = async (voterId, isVerified) => {
    try {
      // Add verification date when verifying a voter
      const verificationDate = isVerified ? new Date().toISOString() : null;
      await axios.patch(`http://localhost:8001/api/voters/${voterId}`, { 
        verified: isVerified,
        verificationDate: verificationDate 
      });
      
      setVoters(prevVoters => prevVoters.map(voter =>
        voter._id === voterId ? { 
          ...voter, 
          verified: isVerified,
          verificationDate: verificationDate
        } : voter
      ));
    // eslint-disable-next-line no-unused-vars
    } catch (err) {
      alert('Failed to update verification status. Please try again.');
    }
  };

  const handleDeleteVoter = async (voterId) => {
    if (!window.confirm('Are you sure you want to delete this voter?')) return;

    try {
      await axios.delete(`http://localhost:8001/api/voters/${voterId}`);
      setVoters(prevVoters => prevVoters.filter(voter => voter._id !== voterId));
    // eslint-disable-next-line no-unused-vars
    } catch (err) {
      alert('Failed to delete voter. Please try again.');
    }
  };

  const filteredVoters = voters.filter(voter => {
    const matchesSearch =
      voter.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      voter.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      voter.houseId.toLowerCase().includes(searchTerm.toLowerCase());

    if (filter === 'all') return matchesSearch;
    if (filter === 'verified') return matchesSearch && voter.verified;
    if (filter === 'unverified') return matchesSearch && !voter.verified;
    return matchesSearch;
  });

  const paginatedVoters = filteredVoters.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleReportDownload = () => {
    const header = 'Name,Email,House ID,Status,Registration Date,Verification Date\n';
    const rows = voters.map(voter => {
      return `${voter.name},${voter.email},${voter.houseId},${voter.verified ? 'Verified' : 'Pending'},${new Date(voter.registrationDate).toLocaleDateString()},${voter.verificationDate ? new Date(voter.verificationDate).toLocaleDateString() : 'Not Verified'}`;
    }).join('\n');

    const csvContent = header + rows;
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    if (link.download !== undefined) { // feature detection
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', 'voters_report.csv');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen p-2 mb-0">
      <div className="max-w-7xl mx-auto">
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-t-xl shadow-md">
          <div className="px-6 py-8 md:flex md:items-center md:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white">Voters Management</h1>
              <p className="mt-1 text-blue-100">Manage and verify registered voters</p>
            </div>
            <div className="mt-4 md:mt-0">
              <button
                onClick={() => alert('This would navigate to registration page')}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-blue-600 bg-white hover:bg-blue-50"
              >
                Add New Voter
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-b-xl shadow-md overflow-hidden">
          <div className="px-6 py-4">
            <div className="mb-4">
              <input
                type="text"
                value={searchTerm}
                onChange={handleSearchChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                placeholder="Search by name, email, or house ID"
              />
            </div>
            <div className="flex justify-between items-center">
              <div className="flex space-x-2">
                <button
                  onClick={() => setFilter('all')}
                  className={`px-4 py-2 text-sm font-medium rounded-lg ${filter === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
                >
                  All
                </button>
                <button
                  onClick={() => setFilter('verified')}
                  className={`px-4 py-2 text-sm font-medium rounded-lg ${filter === 'verified' ? 'bg-green-600 text-white' : 'bg-gray-200'}`}
                >
                  Verified
                </button>
                <button
                  onClick={() => setFilter('unverified')}
                  className={`px-4 py-2 text-sm font-medium rounded-lg ${filter === 'unverified' ? 'bg-yellow-600 text-white' : 'bg-gray-200'}`}
                >
                  Unverified
                </button>
              </div>
              <button
                onClick={handleReportDownload}
                className="px-4 py-2 text-sm font-medium text-white bg-gray-600 rounded-lg"
              >
                Download Report
              </button>
            </div>
          </div>

          {isLoading ? (
            <div className="p-20 flex justify-center">
              <svg className="animate-spin h-8 w-8 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </div>
          ) : error ? (
            <div className="p-6 text-center text-red-500">{error}</div>
          ) : filteredVoters.length === 0 ? (
            <div className="p-6 text-center text-gray-500">No records found</div>
          ) : (
            <div className="overflow-x-auto max-h-80">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Voter</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">House ID</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Registration Date</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Verification Date</th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {paginatedVoters.map((voter) => (
                    <tr key={voter._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            {voter.photo ? (
                              <img
                                className="h-10 w-10 rounded-full object-cover"
                                src={`http://localhost:8001/${voter.photo}`}
                                alt="Voter"
                              />
                            ) : (
                              <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                              </div>
                            )}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{voter.name}</div>
                            <div className="text-sm text-gray-500">{voter.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">{voter.houseId}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${voter.verified ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}
                        >
                          {voter.verified ? 'Verified' : 'Pending'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(voter.registrationDate).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {voter.verificationDate ? new Date(voter.verificationDate).toLocaleDateString() : 'Not Verified'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => setSelectedVoter(voter)}
                          className="text-blue-600 hover:text-blue-900 mr-3"
                        >
                          View
                        </button>
                        <button
                          onClick={() => handleVerificationStatus(voter._id, !voter.verified)}
                          className={voter.verified ? "text-yellow-600 hover:text-yellow-900 mr-3" : "text-green-600 hover:text-green-900 mr-3"}
                        >
                          {voter.verified ? 'Unverify' : 'Verify'}
                        </button>
                        <button
                          onClick={() => handleDeleteVoter(voter._id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VotersManagement;