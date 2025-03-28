import React, { useState, useEffect } from 'react';
import axios from 'axios';

// Modal Component for Confirmation
const Modal = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-sm w-full">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Confirm Deletion</h2>
        <p className="text-gray-600 mb-4">Are you sure you want to delete this voter?</p>
        <div className="flex justify-end space-x-4">
          <button onClick={onClose} className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md">Cancel</button>
          <button
            onClick={() => { onConfirm(); onClose(); }}
            className="px-4 py-2 bg-red-600 text-white rounded-md"
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
  const [page] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [voterToDelete, setVoterToDelete] = useState(null);

  useEffect(() => {
    const fetchVoters = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(`http://localhost:8001/api/voters?page=${page}&limit=10`);
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
    } catch (err) {
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

  const paginatedVoters = filteredVoters.slice((page - 1) * 10, page * 10);

  return (
    <div className="bg-gray-50 min-h-screen p-2 mb-0">
      <div className="max-w-7xl mx-auto">
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-t-xl shadow-md">
          <div className="px-6 py-8 md:flex md:items-center md:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white">Voters Management</h1>
              <p className="mt-1 text-blue-100">Manage and verify registered voters</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-b-xl shadow-md overflow-hidden">
          <div className="px-6 py-4">
            <div className="mb-4">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                placeholder="Search by name, email, or house ID"
              />
            </div>
            {isLoading ? (
              <div className="p-20 flex justify-center">
                <svg
                  className="animate-spin h-8 w-8 text-blue-600"
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
              <div className="p-6 text-center text-red-500">{error}</div>
            ) : filteredVoters.length === 0 ? (
              <div className="p-6 text-center text-gray-500">No results found</div>
            ) : (
              <div className="overflow-x-auto max-h-80">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">Voter ID</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">Voter</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">House ID</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">Photo</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">Registration Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">Verification Date</th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {paginatedVoters.map((voter) => (
                      <tr key={voter._id}>
                        <td className="px-6 py-4">{voter.voterId}</td>
                        <td className="px-6 py-4">{voter.name}</td>
                        <td className="px-6 py-4">{voter.houseId}</td>
                        <td className="px-6 py-4">
                          {voter.photo ? (
                            <img
                              src={`http://localhost:8001/${voter.photo}`}
                              alt="Voter Photo"
                              className="w-12 h-12 rounded-full object-cover"
                            />
                          ) : (
                            <span className="text-gray-500">No Photo</span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              voter.verified ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                            }`}
                          >
                            {voter.verified ? 'Verified' : 'Pending'}
                          </span>
                        </td>
                        <td className="px-6 py-4">{new Date(voter.registrationDate).toLocaleDateString()}</td>
                        <td className="px-6 py-4">
                          {voter.verificationDate ? new Date(voter.verificationDate).toLocaleDateString() : 'Not Verified'}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button
                            onClick={() => handleVerificationStatus(voter._id, !voter.verified)}
                            disabled={voter.verified}
                            className={`text-sm ${voter.verified ? 'text-gray-400 cursor-not-allowed' : 'text-green-600'}`}
                          >
                            Verify
                          </button>
                          <button
                            onClick={() => handleVerificationStatus(voter._id, false)}
                            disabled={!voter.verified}
                            className={`ml-2 text-sm ${!voter.verified ? 'text-gray-400 cursor-not-allowed' : 'text-yellow-600'}`}
                          >
                            Unverify
                          </button>
                          <button
                            onClick={() => handleDeleteVoter(voter._id)}
                            className="ml-2 text-red-600 hover:text-red-900 text-sm"
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

      {/* Modal Component */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onConfirm={confirmDelete} />
    </div>
  );
};

export default VotersManagement;
