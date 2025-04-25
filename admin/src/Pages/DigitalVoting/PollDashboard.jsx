import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { ChevronDown, ChevronUp, BarChart2, PieChart as PieChartIcon, Trash2, Edit2, AlertTriangle, CheckCircle, Award, TrendingUp, Activity } from 'lucide-react';

// Modal Component for Confirmation
const Modal = ({ isOpen, onClose, onConfirm, message }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-sm w-full">
        <h2 className="text-xl font-semibold text-gray-700 mb-4 flex items-center">
          <AlertTriangle className="mr-2 text-amber-500" size={20} />
          Confirm Deletion
        </h2>
        <p className="text-gray-600 mb-4">{message}</p>
        <div className="flex justify-end space-x-4">
          <button onClick={onClose} className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition">Cancel</button>
          <button
            onClick={() => { onConfirm(); onClose(); }}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition"
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
        <h2 className="text-xl font-semibold text-gray-700 mb-4 flex items-center">
          <Edit2 className="mr-2 text-blue-500" size={20} />
          Edit Poll
        </h2>
        
        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2">Poll Question</label>
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                className="flex-grow px-3 py-2 border rounded-lg mr-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder={`Option ${index + 1}`}
              />
              {options.length > 2 && (
                <button
                  onClick={() => handleRemoveOption(index)}
                  className="bg-red-500 text-white p-2 rounded-lg hover:bg-red-600 transition"
                >
                  <Trash2 size={16} />
                </button>
              )}
            </div>
          ))}
          <button
            onClick={handleAddOption}
            className="bg-blue-500 text-white px-3 py-2 rounded-lg mt-2 hover:bg-blue-600 transition flex items-center"
          >
            <span className="mr-1">+</span> Add Option
          </button>
        </div>

        <div className="flex justify-end space-x-4">
          <button 
            onClick={onClose} 
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition flex items-center"
          >
            <CheckCircle size={16} className="mr-1" /> Update Poll
          </button>
        </div>
      </div>
    </div>
  );
};

// Summary Report Component
const SummaryReport = ({ poll }) => {
  // Calculate total votes for this poll
  const totalVotes = poll.options.reduce((sum, opt) => sum + opt.votes, 0);
  
  // Sort options by votes (descending)
  const sortedOptions = [...poll.options].sort((a, b) => b.votes - a.votes);
  
  // Calculate leading option's percentage
  const leadingOption = sortedOptions[0];
  const leadingPercentage = totalVotes > 0 ? ((leadingOption.votes / totalVotes) * 100).toFixed(1) : 0;
  
  // Calculate second-place option's percentage
  const secondOption = sortedOptions[1];
  const secondPercentage = totalVotes > 0 && secondOption ? ((secondOption.votes / totalVotes) * 100).toFixed(1) : 0;
  
  // Calculate margin between leader and second place
  const marginLeadership = leadingOption && secondOption ? (leadingPercentage - secondPercentage).toFixed(1) : 0;
  
  // Calculate participation level (just a placeholder since we don't have eligible voters data)
  const participationLevel = totalVotes > 20 ? "High" : totalVotes > 10 ? "Medium" : "Low";
  
  // Get distribution level
  const getDistributionLevel = () => {
    if (!totalVotes) return "No votes";
    
    // Calculate standard deviation of votes distribution
    const mean = totalVotes / poll.options.length;
    const variance = poll.options.reduce((sum, opt) => sum + Math.pow(opt.votes - mean, 2), 0) / poll.options.length;
    const stdDev = Math.sqrt(variance);
    
    const coefficient = stdDev / mean;
    
    if (coefficient > 1.2) return "Highly skewed";
    if (coefficient > 0.8) return "Moderately skewed";
    if (coefficient > 0.4) return "Slightly skewed";
    return "Evenly distributed";
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
      <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
        <Activity className="mr-2 text-blue-600" size={24} />
        Poll Summary Report
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h4 className="font-semibold text-gray-700 mb-3">Key Metrics</h4>
          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-full mr-3">
                  <Activity size={18} className="text-blue-700" />
                </div>
                <span className="text-gray-700">Total Votes</span>
              </div>
              <span className="font-bold text-lg">{totalVotes}</span>
            </div>
            
            <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-full mr-3">
                  <Award size={18} className="text-green-700" />
                </div>
                <span className="text-gray-700">Leading Option</span>
              </div>
              <span className="font-bold text-green-600">{leadingOption ? leadingOption.option : 'N/A'}</span>
            </div>
            
            <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
              <div className="flex items-center">
                <div className="p-2 bg-purple-100 rounded-full mr-3">
                  <BarChart2 size={18} className="text-purple-700" />
                </div>
                <span className="text-gray-700">Distribution</span>
              </div>
              <span className="font-medium">{getDistributionLevel()}</span>
            </div>
          </div>
        </div>
        
        <div>
          <h4 className="font-semibold text-gray-700 mb-3">Analysis</h4>
          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 bg-amber-50 rounded-lg">
              <div className="flex items-center">
                <div className="p-2 bg-amber-100 rounded-full mr-3">
                  <TrendingUp size={18} className="text-amber-700" />
                </div>
                <span className="text-gray-700">Leading Share</span>
              </div>
              <span className="font-bold">{leadingPercentage}%</span>
            </div>
            
            <div className="flex justify-between items-center p-3 bg-indigo-50 rounded-lg">
              <div className="flex items-center">
                <div className="p-2 bg-indigo-100 rounded-full mr-3">
                  <ChevronUp size={18} className="text-indigo-700" />
                </div>
                <span className="text-gray-700">Leadership Margin</span>
              </div>
              <span className={`font-bold ${Number(marginLeadership) > 10 ? 'text-green-600' : 'text-amber-600'}`}>
                {marginLeadership}%
              </span>
            </div>
            
            <div className="flex justify-between items-center p-3 bg-pink-50 rounded-lg">
              <div className="flex items-center">
                <div className="p-2 bg-pink-100 rounded-full mr-3">
                  <PieChartIcon size={18} className="text-pink-700" />
                </div>
                <span className="text-gray-700">Participation</span>
              </div>
              <span className={`font-medium ${
                participationLevel === "High" ? "text-green-600" : 
                participationLevel === "Medium" ? "text-amber-600" : "text-red-600"
              }`}>
                {participationLevel}
              </span>
            </div>
          </div>
        </div>
      </div>
      
      {totalVotes > 0 && (
        <div className="mt-6">
          <h4 className="font-semibold text-gray-700 mb-3">Key Insights</h4>
          <div className="p-4 bg-gray-50 rounded-lg text-gray-700">
            <ul className="list-disc pl-5 space-y-2">
              <li>
                <strong>{leadingOption.option}</strong> is leading with {leadingPercentage}% of votes 
                ({leadingOption.votes} votes)
              </li>
              {secondOption && (
                <li>
                  <strong>{secondOption.option}</strong> is in second place with {secondPercentage}% 
                  ({secondOption.votes} votes)
                </li>
              )}
              <li>
                The options are <strong>{getDistributionLevel().toLowerCase()}</strong> among the {poll.options.length} choices
              </li>
              {Number(marginLeadership) > 20 && (
                <li>
                  There is a <strong>significant lead</strong> with a {marginLeadership}% margin between first and second place
                </li>
              )}
              {Number(marginLeadership) <= 5 && Number(marginLeadership) > 0 && (
                <li>
                  The race is <strong>very close</strong> with only a {marginLeadership}% difference between first and second place
                </li>
              )}
            </ul>
          </div>
        </div>
      )}
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
  const [expandedPoll, setExpandedPoll] = useState(null);
  const [chartType, setChartType] = useState({});

  useEffect(() => {
    const fetchPollData = async () => {
      try {
        const { data } = await axios.get('http://localhost:8001/api/polls');
        setPolls(data);
        
        // Initialize chart type preferences
        const initialChartTypes = {};
        data.forEach(poll => {
          initialChartTypes[poll._id] = 'bar';
        });
        setChartType(initialChartTypes);
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching poll data:', error);
        setLoading(false);
      }
    };
    
    fetchPollData();
  }, []);

  // Toggle poll expansion
  const togglePollExpansion = (pollId) => {
    setExpandedPoll(expandedPoll === pollId ? null : pollId);
  };

  // Toggle chart type
  const toggleChartType = (pollId) => {
    setChartType({
      ...chartType,
      [pollId]: chartType[pollId] === 'bar' ? 'pie' : 'bar'
    });
  };

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
    <div className="w-full p-6 bg-gray-50 rounded-lg">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800 flex items-center">
          <BarChart2 className="mr-2 text-blue-600" />
          Poll Results Dashboard
        </h1>
        <div className="text-sm text-gray-500">
          {polls.length} {polls.length === 1 ? 'Poll' : 'Polls'} Available
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : polls.length > 0 ? (
        <div className="space-y-6">
          {polls.map((poll) => {
            // Calculate total votes for this poll
            const totalVotes = poll.options.reduce((sum, opt) => sum + opt.votes, 0);
            const isExpanded = expandedPoll === poll._id;
            
            return (
              <div key={poll._id} className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
                <div 
                  className="px-6 py-4 cursor-pointer flex justify-between items-center hover:bg-gray-50"
                  onClick={() => togglePollExpansion(poll._id)}
                >
                  <h2 className="text-xl font-semibold text-gray-800">{poll.question}</h2>
                  <div className="flex items-center">
                    <span className="text-sm text-gray-500 mr-3">{totalVotes} votes</span>
                    {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                  </div>
                </div>
                
                {isExpanded && (
                  <div className="p-6 border-t border-gray-200">
                    {/* Action Buttons */}
                    <div className="flex justify-end space-x-2 mb-4">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleChartType(poll._id);
                        }}
                        className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition flex items-center"
                      >
                        {chartType[poll._id] === 'bar' ? <PieChartIcon size={16} className="mr-1" /> : <BarChart2 size={16} className="mr-1" />}
                        Switch to {chartType[poll._id] === 'bar' ? 'Pie' : 'Bar'} Chart
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditPoll(poll);
                        }}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition flex items-center"
                      >
                        <Edit2 size={16} className="mr-1" /> Edit Poll
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeletePoll(poll._id);
                        }}
                        className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition flex items-center"
                      >
                        <Trash2 size={16} className="mr-1" /> Delete Poll
                      </button>
                    </div>

                    {/* Current Trends Section */}
                    <div className="mb-6">
                      <h3 className="text-lg font-semibold text-gray-700 mb-3 flex items-center">
                        <TrendingUp className="mr-2 text-blue-500" size={18} />
                        Current Trends
                      </h3>
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                        {poll.options.map(option => {
                          const percentage = calculateTrendPercentage(option.votes, totalVotes);
                          const trend = getTrendStatus(percentage);
                          
                          return (
                            <div key={option._id} className="flex items-center justify-between p-3 border rounded-lg bg-gray-50 hover:shadow-md transition">
                              <div className="flex-1">
                                <p className="font-medium text-gray-800 truncate" title={option.option}>{option.option}</p>
                                <p className="text-sm text-gray-500">Votes: {option.votes}</p>
                              </div>
                              <div className="flex items-center">
                                <span className={`text-xl ${
                                  trend === 'up' ? 'text-green-500' : 
                                  trend === 'down' ? 'text-red-500' : 
                                  'text-gray-500'
                                }`}>
                                  {trend === 'up' ? '↑' : trend === 'down' ? '↓' : '→'}
                                </span>
                                <span className={`ml-1 text-sm ${
                                  trend === 'up' ? 'text-green-500' : 
                                  trend === 'down' ? 'text-red-500' : 
                                  'text-gray-500'
                                }`}>
                                  {percentage}%
                                </span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Data Visualization Section */}
                    <div className="mb-6">
                      <h3 className="text-lg font-semibold text-gray-700 mb-3 flex items-center">
                        {chartType[poll._id] === 'bar' ? 
                          <BarChart2 className="mr-2 text-blue-500" size={18} /> :
                          <PieChartIcon className="mr-2 text-blue-500" size={18} />
                        }
                        Votes Distribution Chart
                      </h3>
                      
                      <div className="border rounded-lg p-4 bg-gray-50">
                        <ResponsiveContainer width="100%" height={300}>
                          {chartType[poll._id] === 'bar' ? (
                            <BarChart data={poll.options.map(opt => ({ name: opt.option, votes: opt.votes }))}>
                              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                              <YAxis tick={{ fontSize: 12 }} />
                              <Tooltip 
                                contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.15)' }}
                                formatter={(value) => [`${value} votes`, 'Votes']}
                              />
                              <Bar dataKey="votes" fill="#4f46e5">
                                {poll.options.map((_, index) => (
                                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                              </Bar>
                            </BarChart>
                          ) : (
                            <PieChart>
                              <Pie
                                data={poll.options.map(opt => ({ name: opt.option, value: opt.votes }))}
                                cx="50%"
                                cy="50%"
                                outerRadius={120}
                                fill="#8884d8"
                                dataKey="value"
                                labelLine={true}
                                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                              >
                                {poll.options.map((_, index) => (
                                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                              </Pie>
                              <Tooltip 
                                formatter={(value) => [`${value} votes`, 'Votes']}
                                contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.15)' }}
                              />
                              <Legend />
                            </PieChart>
                          )}
                        </ResponsiveContainer>
                      </div>
                    </div>
                    
                    {/* Summary Report */}
                    <SummaryReport poll={poll} />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white text-center py-12 rounded-lg shadow-md border border-gray-200">
          <div className="text-gray-400 mb-3">
            <AlertTriangle size={48} className="mx-auto" />
          </div>
          <p className="text-gray-700 text-lg font-medium">No poll results available</p>
          <p className="text-sm text-gray-500 mt-2">Create your first poll to see results here</p>
        </div>
      )}

      {/* Modal Components */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={confirmDelete}
        message="Are you sure you want to delete this poll? This action cannot be undone."
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