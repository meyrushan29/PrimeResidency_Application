import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';

// Modal Component for Confirmation
const Modal = ({ isOpen, onClose, onConfirm, message }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-sm w-full">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Confirm Deletion</h2>
        <p className="text-gray-600 mb-4">{message}</p>
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

// Edit Poll Modal Component
const EditPollModal = ({ isOpen, onClose, poll, onUpdate }) => {
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState([]);

  useEffect(() => {
    if (poll) {
      setQuestion(poll.question);
      setOptions(poll.options.map(opt => opt.option));
    }
  }, [poll]);

  const handleAddOption = () => {
    setOptions([...options, '']);
  };

  const handleOptionChange = (index, value) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const handleRemoveOption = (index) => {
    if (options.length > 2) {
      const newOptions = options.filter((_, i) => i !== index);
      setOptions(newOptions);
    }
  };

  const handleSubmit = () => {
    if (!question || options.length < 2) {
      alert('Please provide a question and at least two options');
      return;
    }
    onUpdate(poll._id, { question, options });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Edit Poll</h2>
        
        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2">Poll Question</label>
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg"
          />
        </div>
        
        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2">Poll Options</label>
          {options.map((option, index) => (
            <div key={index} className="flex items-center mb-2">
              <input
                type="text"
                value={option}
                onChange={(e) => handleOptionChange(index, e.target.value)}
                className="flex-grow px-3 py-2 border rounded-lg mr-2"
              />
              {options.length > 2 && (
                <button
                  onClick={() => handleRemoveOption(index)}
                  className="bg-red-500 text-white px-3 py-2 rounded-lg"
                >
                  Remove
                </button>
              )}
            </div>
          ))}
          <button
            onClick={handleAddOption}
            className="bg-blue-500 text-white px-3 py-2 rounded-lg mt-2"
          >
            Add Option
          </button>
        </div>
        
        <div className="flex justify-end space-x-4">
          <button 
            onClick={onClose} 
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-green-600 text-white rounded-md"
          >
            Update Poll
          </button>
        </div>
      </div>
    </div>
  );
};

const PollDashboard = () => {
  const [polls, setPolls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [pollToDelete, setPollToDelete] = useState(null);
  const [pollToEdit, setPollToEdit] = useState(null);

  useEffect(() => {
    const fetchPollData = async () => {
      try {
        const { data } = await axios.get('http://localhost:8001/api/polls');
        setPolls(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching poll data:', error);
        setLoading(false);
      }
    };
    
    fetchPollData();
  }, []);

  // Calculate trend percentage
  const calculateTrendPercentage = (votes, totalVotes) => {
    if (totalVotes === 0) return 0;
    return ((votes / totalVotes) * 100).toFixed(1);
  };

  // Get trend status based on percentage
  const getTrendStatus = (percentage) => {
    if (percentage > 60) return 'up';
    if (percentage < 40) return 'down';
    return 'stable';
  };

  const getTrendIcon = (trend) => {
    switch (trend) {
      case 'up':
        return '↑'; // Unicode up arrow
      case 'down':
        return '↓'; // Unicode down arrow
      default:
        return '→'; // Unicode right arrow for stable
    }
  };

  const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#ffbb28', '#0088FE', '#00C49F'];

  const handleDeletePoll = (pollId) => {
    setPollToDelete(pollId);
    setIsModalOpen(true);
  };

  const handleEditPoll = (poll) => {
    setPollToEdit(poll);
    setIsEditModalOpen(true);
  };

  const confirmDelete = async () => {
    try {
      await axios.delete(`http://localhost:8001/api/polls/${pollToDelete}`);
      setPolls(polls.filter(poll => poll._id !== pollToDelete)); // Remove deleted poll from the list
    } catch (error) {
      console.error('Error deleting poll:', error);
    }
  };

  const updatePoll = async (pollId, updatedData) => {
    try {
      const { data } = await axios.put(`http://localhost:8001/api/polls/${pollId}`, updatedData);
      
      // Update the polls state with the updated poll
      setPolls(polls.map(poll => 
        poll._id === pollId ? data.poll : poll
      ));
    } catch (error) {
      console.error('Error updating poll:', error);
      alert('Failed to update poll');
    }
  };

  return (
    <div className="w-full p-0 bg-white rounded-lg">
      <h1 className="text-2xl font-semibold text-gray-800 mb-0">Poll Results</h1>

      {loading ? (
        <p className="text-gray-500 text-center py-8">Loading poll data...</p>
      ) : polls.length > 0 ? (
        polls.map((poll, index) => {
          // Calculate total votes for this poll
          const totalVotes = poll.options.reduce((sum, opt) => sum + opt.votes, 0);
          
          return (
            <div key={poll._id} className="mb-4 p-4 border border-gray-200 rounded-lg">
              <h2 className="text-xl font-semibold text-gray-800 mb-3">{poll.question}</h2>
              
              {/* Action Buttons */}
              <div className="flex justify-end space-x-2">
                <button
                  onClick={() => handleEditPoll(poll)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md"
                >
                  Edit Poll
                </button>
                <button
                  onClick={() => handleDeletePoll(poll._id)}
                  className="px-4 py-2 bg-red-600 text-white rounded-md"
                >
                  Delete Poll
                </button>
              </div>

              {/* Compact Current Trends Section */}
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-gray-600 mb-2">Current Trends</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                  {poll.options.map(option => {
                    const percentage = calculateTrendPercentage(option.votes, totalVotes);
                    const trend = getTrendStatus(percentage);
                    
                    return (
                      <div key={option._id} className="flex items-center justify-between p-3 border rounded-lg bg-gray-50">
                        <div className="flex-1">
                          <p className="font-medium text-gray-800">{option.option}</p>
                          <p className="text-sm text-gray-500">Votes: {option.votes}</p>
                        </div>
                        <div className="flex items-center">
                          <span className={`text-xl ${trend === 'up' ? 'text-green-500' : trend === 'down' ? 'text-red-500' : 'text-gray-500'}`}>
                            {getTrendIcon(trend)}
                          </span>
                          <span className={`ml-1 text-sm ${trend === 'up' ? 'text-green-500' : trend === 'down' ? 'text-red-500' : 'text-gray-500'}`}>
                            {percentage}%
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
              
              {/* Compact Data Visualization Section */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Bar Chart */}
                <div className="border rounded-lg p-3">
                  <h3 className="text-md font-semibold text-gray-600 mb-2">Votes Distribution</h3>
                  <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={poll.options.map(opt => ({ name: opt.option, votes: opt.votes }))}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                      <YAxis tick={{ fontSize: 12 }} />
                      <Tooltip />
                      <Bar dataKey="votes" fill={COLORS[index % COLORS.length]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                {/* Pie Chart */}
                <div className="border rounded-lg p-3">
                  <h3 className="text-md font-semibold text-gray-600 mb-2">Proportion</h3>
                  <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                      <Pie
                        data={poll.options.map(opt => ({ name: opt.option, value: opt.votes }))}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        labelLine={false}
                      >
                        {poll.options.map((_, i) => (
                          <Cell key={`cell-${i}`} fill={COLORS[i % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
              
              {/* Summary Stats */}
              <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <div className="text-center">
                    <p className="text-sm text-gray-500">Total Votes</p>
                    <p className="text-lg font-semibold">{totalVotes}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-500">Options</p>
                    <p className="text-lg font-semibold">{poll.options.length}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-500">Leading Option</p>
                    <p className="text-lg font-semibold">
                      {poll.options.reduce((max, opt) => opt.votes > max.votes ? opt : max, poll.options[0]).option}
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-500">Status</p>
                    <p className="text-lg font-semibold text-blue-500">Active</p>
                  </div>
                </div>
              </div>
            </div>
          );
        })
      ) : (
        <div className="text-center py-0 mt-0 border rounded-lg">
          <p className="text-gray-500">No poll results available.</p>
          <p className="text-sm text-gray-400 mt-2">Poll data will appear here once created.</p>
        </div>
      )}

      {/* Modal Components */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={confirmDelete}
        message="Are you sure you want to delete this poll?"
      />

      <EditPollModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        poll={pollToEdit}
        onUpdate={updatePoll}
      />
    </div>
  );
};

export default PollDashboard;