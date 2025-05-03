import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { 
  ChevronDown, ChevronUp, BarChart2, PieChart as PieChartIcon, Trash2, Edit2, 
  AlertTriangle, CheckCircle, Award, TrendingUp, Activity, HelpCircle, Info, 
  Users, Filter, RefreshCw, Search, Eye, EyeOff, Settings, Share2
} from 'lucide-react';

// Tooltip Component for Help Icons
const HelpTooltip = ({ text }) => {
  const [isVisible, setIsVisible] = useState(false);
  
  return (
    <div className="relative inline-block ml-1">
      <div 
        className="text-gray-400 cursor-pointer hover:text-gray-600 transition"
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
      >
        <HelpCircle size={16} />
      </div>
      {isVisible && (
        <div className="absolute z-10 w-64 p-3 bg-gray-800 text-white text-sm rounded-md shadow-lg bottom-full left-1/2 transform -translate-x-1/2 -translate-y-2">
          {text}
          <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 rotate-45 w-2 h-2 bg-gray-800"></div>
        </div>
      )}
    </div>
  );
};

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
          <button 
            onClick={onClose} 
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition"
          >
            Cancel
          </button>
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
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (poll) {
      setQuestion(poll.question);
      setOptions(poll.options.map(opt => opt.option));
      setErrors({});
    }
  }, [poll]);

  const handleAddOption = () => {
    setOptions([...options, '']);
  };

  const handleOptionChange = (index, value) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
    
    // Clear error for this option if it exists
    if (errors[`option-${index}`]) {
      const newErrors = {...errors};
      delete newErrors[`option-${index}`];
      setErrors(newErrors);
    }
  };

  const handleRemoveOption = (index) => {
    if (options.length > 2) {
      const newOptions = options.filter((_, i) => i !== index);
      setOptions(newOptions);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    let isValid = true;
    
    if (!question.trim()) {
      newErrors.question = 'Question is required';
      isValid = false;
    }
    
    options.forEach((option, index) => {
      if (!option.trim()) {
        newErrors[`option-${index}`] = 'Option cannot be empty';
        isValid = false;
      }
    });
    
    // Check for duplicate options
    const uniqueOptions = new Set(options.map(opt => opt.trim()));
    if (uniqueOptions.size !== options.length) {
      newErrors.duplicate = 'Duplicate options are not allowed';
      isValid = false;
    }
    
    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = () => {
    if (!validateForm()) {
      return;
    }
    
    // Format options as expected by the backend:
    // The backend expects an array of strings, not objects with 'option' property
    const formattedOptions = options.map(option => String(option).trim());
    
    onUpdate(poll._id, { 
      question: question.trim(),
      options: formattedOptions
    });
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
          <label className="block text-gray-700 font-medium mb-2">Poll Question</label>
          <input
            type="text"
            value={question}
            onChange={(e) => {
              setQuestion(e.target.value);
              if (errors.question) {
                const newErrors = {...errors};
                delete newErrors.question;
                setErrors(newErrors);
              }
            }}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.question ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Enter your question here"
          />
          {errors.question && (
            <p className="text-red-500 text-sm mt-1">{errors.question}</p>
          )}
        </div>
        
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <label className="block text-gray-700 font-medium">Poll Options</label>
            <span className="text-sm text-gray-500">Minimum 2 options required</span>
          </div>
          
          {errors.duplicate && (
            <p className="text-red-500 text-sm mb-2 p-2 bg-red-50 rounded-md">{errors.duplicate}</p>
          )}
          
          {options.map((option, index) => (
            <div key={index} className="flex items-center mb-2">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex justify-center items-center mr-2 text-blue-600 font-medium">
                {index + 1}
              </div>
              <input
                type="text"
                value={option}
                onChange={(e) => handleOptionChange(index, e.target.value)}
                className={`flex-grow px-3 py-2 border rounded-lg mr-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors[`option-${index}`] ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder={`Option ${index + 1}`}
              />
              {options.length > 2 && (
                <button
                  onClick={() => handleRemoveOption(index)}
                  className="bg-gray-200 text-gray-600 p-2 rounded-lg hover:bg-red-100 hover:text-red-600 transition"
                  title="Remove option"
                >
                  <Trash2 size={16} />
                </button>
              )}
              {errors[`option-${index}`] && (
                <p className="text-red-500 text-sm absolute mt-10">{errors[`option-${index}`]}</p>
              )}
            </div>
          ))}
          <button
            onClick={handleAddOption}
            className="bg-blue-50 text-blue-600 border border-blue-200 px-3 py-2 rounded-lg mt-2 hover:bg-blue-100 transition flex items-center w-full justify-center"
          >
            <span className="mr-1">+</span> Add Another Option
          </button>
        </div>

        <div className="flex justify-end space-x-4 mt-6">
          <button 
            onClick={onClose} 
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition border border-gray-300"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition flex items-center"
          >
            <CheckCircle size={16} className="mr-1" /> Update Poll
          </button>
        </div>
      </div>
    </div>
  );
};

// Summary Report Component with improved UI
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
  
  // Calculate participation level (just a placeholder)
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
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold text-gray-800 flex items-center">
          <Activity className="mr-2 text-blue-600" size={24} />
          Poll Summary Report
        </h3>
        <div className="flex items-center">
          <span className="text-sm text-gray-500 mr-2">Last updated: Today</span>
          <RefreshCw size={16} className="text-blue-500 cursor-pointer hover:text-blue-700" />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-semibold text-gray-700">Key Metrics</h4>
            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">Overview</span>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg border border-blue-100">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-full mr-3">
                  <Activity size={18} className="text-blue-700" />
                </div>
                <span className="text-gray-700">Total Votes</span>
              </div>
              <div className="flex items-center">
                <span className="font-bold text-lg text-blue-700">{totalVotes}</span>
                <HelpTooltip text="The total number of votes recorded for this poll across all options." />
              </div>
            </div>
            
            <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg border border-green-100">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-full mr-3">
                  <Award size={18} className="text-green-700" />
                </div>
                <span className="text-gray-700">Leading Option</span>
              </div>
              <div className="flex items-center">
                <span className="font-bold text-green-600">{leadingOption ? leadingOption.option : 'N/A'}</span>
                <HelpTooltip text="The option that has received the most votes so far." />
              </div>
            </div>
            
            <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg border border-purple-100">
              <div className="flex items-center">
                <div className="p-2 bg-purple-100 rounded-full mr-3">
                  <BarChart2 size={18} className="text-purple-700" />
                </div>
                <span className="text-gray-700">Distribution</span>
              </div>
              <div className="flex items-center">
                <span className="font-medium text-purple-600">{getDistributionLevel()}</span>
                <HelpTooltip text="How evenly the votes are distributed across all options." />
              </div>
            </div>
          </div>
        </div>
        
        <div>
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-semibold text-gray-700">Analysis</h4>
            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">Insights</span>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 bg-amber-50 rounded-lg border border-amber-100">
              <div className="flex items-center">
                <div className="p-2 bg-amber-100 rounded-full mr-3">
                  <TrendingUp size={18} className="text-amber-700" />
                </div>
                <span className="text-gray-700">Leading Share</span>
              </div>
              <div className="flex items-center">
                <span className="font-bold text-amber-600">{leadingPercentage}%</span>
                <HelpTooltip text="Percentage of total votes received by the leading option." />
              </div>
            </div>
            
            <div className="flex justify-between items-center p-3 bg-indigo-50 rounded-lg border border-indigo-100">
              <div className="flex items-center">
                <div className="p-2 bg-indigo-100 rounded-full mr-3">
                  <ChevronUp size={18} className="text-indigo-700" />
                </div>
                <span className="text-gray-700">Leadership Margin</span>
              </div>
              <div className="flex items-center">
                <span className={`font-bold ${Number(marginLeadership) > 10 ? 'text-green-600' : 'text-amber-600'}`}>
                  {marginLeadership}%
                </span>
                <HelpTooltip text="The percentage difference between the first and second place options." />
              </div>
            </div>
            
            <div className="flex justify-between items-center p-3 bg-pink-50 rounded-lg border border-pink-100">
              <div className="flex items-center">
                <div className="p-2 bg-pink-100 rounded-full mr-3">
                  <Users size={18} className="text-pink-700" />
                </div>
                <span className="text-gray-700">Participation</span>
              </div>
              <div className="flex items-center">
                <span className={`font-medium ${
                  participationLevel === "High" ? "text-green-600" : 
                  participationLevel === "Medium" ? "text-amber-600" : "text-red-600"
                }`}>
                  {participationLevel}
                </span>
                <HelpTooltip text="A relative measure of voter participation in this poll." />
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {totalVotes > 0 && (
        <div className="mt-6">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-semibold text-gray-700 flex items-center">
              Key Insights
              <Info size={16} className="ml-2 text-blue-500" />
            </h4>
            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">Summary</span>
          </div>
          <div className="p-4 bg-blue-50 rounded-lg text-gray-700 border border-blue-100">
            <ul className="list-disc pl-5 space-y-2">
              <li>
                <strong>{leadingOption.option}</strong> is leading with <span className="text-blue-600 font-bold">{leadingPercentage}%</span> of votes 
                ({leadingOption.votes} votes)
              </li>
              {secondOption && (
                <li>
                  <strong>{secondOption.option}</strong> is in second place with <span className="text-blue-600 font-bold">{secondPercentage}%</span> 
                  ({secondOption.votes} votes)
                </li>
              )}
              <li>
                The options are <strong>{getDistributionLevel().toLowerCase()}</strong> among the {poll.options.length} choices
              </li>
              {Number(marginLeadership) > 20 && (
                <li>
                  There is a <strong className="text-green-600">significant lead</strong> with a {marginLeadership}% margin between first and second place
                </li>
              )}
              {Number(marginLeadership) <= 5 && Number(marginLeadership) > 0 && (
                <li>
                  The race is <strong className="text-amber-600">very close</strong> with only a {marginLeadership}% difference between first and second place
                </li>
              )}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

// Main Poll Dashboard Component
const PollDashboard = () => {
  const [polls, setPolls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [pollToDelete, setPollToDelete] = useState(null);
  const [pollToEdit, setPollToEdit] = useState(null);
  const [expandedPoll, setExpandedPoll] = useState(null);
  const [chartType, setChartType] = useState({});
  const [filterQuery, setFilterQuery] = useState('');
  const [sortBy, setSortBy] = useState('recent'); // Options: 'recent', 'popular', 'alphabetical'
  const [viewMode, setViewMode] = useState('detailed'); // Options: 'compact', 'detailed'
  const [showTutorial, setShowTutorial] = useState(true);

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
        
        // Auto-expand the first poll if there's only one
        if (data.length === 1) {
          setExpandedPoll(data[0]._id);
        }
      } catch (error) {
        console.error('Error fetching poll data:', error);
        setLoading(false);
      }
    };
    
    fetchPollData();
  }, []);

  // Filter and sort polls
  const filteredPolls = polls.filter(poll => 
    poll.question.toLowerCase().includes(filterQuery.toLowerCase()) ||
    poll.options.some(opt => opt.option.toLowerCase().includes(filterQuery.toLowerCase()))
  );
  
  const sortedPolls = [...filteredPolls].sort((a, b) => {
    if (sortBy === 'popular') {
      const votesA = a.options.reduce((sum, opt) => sum + opt.votes, 0);
      const votesB = b.options.reduce((sum, opt) => sum + opt.votes, 0);
      return votesB - votesA;
    } else if (sortBy === 'alphabetical') {
      return a.question.localeCompare(b.question);
    }
    // Default to 'recent' - assuming _id has timestamp info or add a createdAt field
    return a._id < b._id ? 1 : -1;
  });

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

  const COLORS = ['#4f46e5', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#ec4899'];

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
      setPolls(polls.filter(poll => poll._id !== pollToDelete));
    } catch (error) {
      console.error('Error deleting poll:', error);
    }
  };

  const updatePoll = async (pollId, updatedData) => {
    try {
      console.log('Sending data to update poll:', updatedData);
      const { data } = await axios.put(`http://localhost:8001/api/polls/${pollId}`, updatedData);
      
      // Update the polls state with the updated poll
      setPolls(polls.map(poll => 
        poll._id === pollId ? data.poll : poll
      ));
    } catch (error) {
      console.error('Error updating poll:', error);
      alert(`Failed to update poll: ${error.response?.data?.message || error.message}`);
    }
  };

  // Render tutorial banner
  const TutorialBanner = () => {
    if (!showTutorial) return null;
    
    return (
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 relative">
        <button 
          className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
          onClick={() => setShowTutorial(false)}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
        <h3 className="text-blue-800 font-bold text-lg mb-2 flex items-center">
          <Info size={20} className="mr-2" />
          Welcome to Your Poll Dashboard
        </h3>
        <p className="text-blue-700 mb-3">
          Here's how to get the most out of your poll management experience:
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-3 rounded-md border border-blue-100 shadow-sm">
            <div className="flex items-center text-blue-800 font-semibold mb-1">
              <BarChart2 size={16} className="mr-1" />
              View & Analyze
            </div>
            <p className="text-sm text-gray-600">Click on any poll to expand and see detailed results, charts, and insights</p>
          </div>
          <div className="bg-white p-3 rounded-md border border-blue-100 shadow-sm">
            <div className="flex items-center text-blue-800 font-semibold mb-1">
              <Edit2 size={16} className="mr-1" />
              Edit & Manage
            </div>
            <p className="text-sm text-gray-600">Use the edit button to modify poll questions and options at any time</p>
          </div>
          <div className="bg-white p-3 rounded-md border border-blue-100 shadow-sm">
            <div className="flex items-center text-blue-800 font-semibold mb-1">
              <Filter size={16} className="mr-1" />
              Filter & Sort
            </div>
            <p className="text-sm text-gray-600">Use the search and sort controls to quickly find specific polls</p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="w-full bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6 border border-gray-200">
          <div className="flex flex-col md:flex-row justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800 flex items-center mb-4 md:mb-0">
              <BarChart2 className="mr-2 text-blue-600" />
              Poll Results Dashboard
            </h1>
            <div className="flex items-center space-x-2">
              <div className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm font-medium border border-blue-100">
                {polls.length} {polls.length === 1 ? 'Poll' : 'Polls'} Available
              </div>
              <button className="bg-blue-100 text-blue-700 p-2 rounded-full hover:bg-blue-200">
                <Share2 size={16} />
              </button>
              <button className="bg-blue-100 text-blue-700 p-2 rounded-full hover:bg-blue-200">
                <Settings size={16} />
              </button>
            </div>
          </div>
          
          {/* Filter Controls */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="relative flex-grow max-w-md">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search size={18} className="text-gray-400" />
              </div>
              <input 
                type="text" 
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Search polls by question or option..."
                value={filterQuery}
                onChange={(e) => setFilterQuery(e.target.value)}
              />
            </div>
            
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <div className="flex items-center">
                <span className="text-sm text-gray-600 mr-2">Sort by:</span>
                <select 
                  className="bg-white border border-gray-300 text-gray-700 rounded-md py-1 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="recent">Most Recent</option>
                  <option value="popular">Most Popular</option>
                  <option value="alphabetical">Alphabetical</option>
                </select>
              </div>
              
              <div className="flex items-center">
                <span className="text-sm text-gray-600 mr-2">View:</span>
                <div className="flex border border-gray-300 rounded-md overflow-hidden">
                  <button 
                    onClick={() => setViewMode('compact')} 
                    className={`px-3 py-1 flex items-center ${viewMode === 'compact' ? 'bg-blue-50 text-blue-700' : 'bg-white text-gray-700'}`}
                    title="Compact View"
                  >
                    <EyeOff size={16} />
                  </button>
                  <button 
                    onClick={() => setViewMode('detailed')} 
                    className={`px-3 py-1 flex items-center ${viewMode === 'detailed' ? 'bg-blue-50 text-blue-700' : 'bg-white text-gray-700'}`}
                    title="Detailed View"
                  >
                    <Eye size={16} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Tutorial Banner */}
        <TutorialBanner />

        {/* Main Content */}
        {loading ? (
          <div className="bg-white rounded-lg shadow-md p-10 flex flex-col items-center justify-center">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500 mb-4"></div>
            <p className="text-gray-600 text-lg">Loading poll data...</p>
            <p className="text-gray-500 text-sm mt-2">This may take a moment</p>
          </div>
        ) : sortedPolls.length > 0 ? (
          <div className="space-y-6">
            {sortedPolls.map((poll) => {
              // Calculate total votes for this poll
              const totalVotes = poll.options.reduce((sum, opt) => sum + opt.votes, 0);
              const isExpanded = expandedPoll === poll._id;
              
              // Find the leading option
              const leadingOption = [...poll.options].sort((a, b) => b.votes - a.votes)[0];
              const leadingPercentage = totalVotes > 0 ? ((leadingOption.votes / totalVotes) * 100).toFixed(0) : 0;
              
              return (
                <div key={poll._id} className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 transition-all duration-300 hover:shadow-lg">
                  <div 
                    className={`px-6 py-4 cursor-pointer flex flex-col sm:flex-row sm:justify-between sm:items-center border-b transition-colors ${isExpanded ? 'border-blue-100 bg-blue-50' : 'border-transparent hover:bg-gray-50'}`}
                    onClick={() => togglePollExpansion(poll._id)}
                  >
                    <div className="flex items-start mb-3 sm:mb-0">
                      <div className={`p-2 rounded-full mr-3 ${isExpanded ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'}`}>
                        <BarChart2 size={20} />
                      </div>
                      <div>
                        <h2 className="text-xl font-semibold text-gray-800 mb-1">{poll.question}</h2>
                        <div className="flex flex-wrap gap-2">
                          <span className="text-sm text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                            {poll.options.length} options
                          </span>
                          <span className="text-sm text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                            {totalVotes} {totalVotes === 1 ? 'vote' : 'votes'}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center">
                      {viewMode === 'detailed' && totalVotes > 0 && (
                        <div className="flex items-center px-3 py-1 bg-green-100 text-green-800 rounded-full mr-4">
                          <Award size={14} className="mr-1" />
                          <span className="text-sm font-medium">
                            Leading: {leadingOption ? leadingOption.option : 'N/A'} ({leadingPercentage}%)
                          </span>
                        </div>
                      )}
                      <div className="bg-gray-100 rounded-full p-1">
                        {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                      </div>
                    </div>
                  </div>
                  
                  {isExpanded && (
                    <div className="p-6">
                      {/* Quick Action Bar */}
                      <div className="bg-gray-50 rounded-lg p-3 mb-6 border border-gray-200 flex flex-wrap gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleChartType(poll._id);
                          }}
                          className="px-3 py-1.5 bg-white text-gray-700 rounded-md hover:bg-gray-100 transition shadow-sm border border-gray-200 flex items-center text-sm"
                        >
                          {chartType[poll._id] === 'bar' ? <PieChartIcon size={14} className="mr-1.5" /> : <BarChart2 size={14} className="mr-1.5" />}
                          Switch to {chartType[poll._id] === 'bar' ? 'Pie' : 'Bar'} Chart
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEditPoll(poll);
                          }}
                          className="px-3 py-1.5 bg-white text-blue-600 rounded-md hover:bg-blue-50 transition shadow-sm border border-blue-200 flex items-center text-sm"
                        >
                          <Edit2 size={14} className="mr-1.5" /> Edit Poll
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeletePoll(poll._id);
                          }}
                          className="px-3 py-1.5 bg-white text-red-600 rounded-md hover:bg-red-50 transition shadow-sm border border-red-200 flex items-center text-sm"
                        >
                          <Trash2 size={14} className="mr-1.5" /> Delete Poll
                        </button>
                        
                        {/* Add some extra helpful buttons */}
                        <button className="px-3 py-1.5 bg-white text-purple-600 rounded-md hover:bg-purple-50 transition shadow-sm border border-purple-200 flex items-center text-sm">
                          <Share2 size={14} className="mr-1.5" /> Share Results
                        </button>
                      </div>

                      {/* Current Trends Section with improved UI */}
                      <div className="mb-6">
                        <div className="flex justify-between items-center mb-3">
                          <h3 className="text-lg font-semibold text-gray-700 flex items-center">
                            <TrendingUp className="mr-2 text-blue-500" size={18} />
                            Current Vote Distribution
                          </h3>
                          <div className="text-sm text-gray-500 bg-blue-50 px-2 py-1 rounded-full border border-blue-100">
                            {poll.options.length} options
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                          {poll.options.map((option, idx) => {
                            const percentage = calculateTrendPercentage(option.votes, totalVotes);
                            const trend = getTrendStatus(percentage);
                            const color = COLORS[idx % COLORS.length];
                            const lightColor = color + '15'; // Adding 15% opacity
                            
                            return (
                              <div 
                                key={option._id} 
                                className="flex flex-col p-4 border rounded-lg hover:shadow-md transition"
                                style={{ borderColor: color, backgroundColor: lightColor }}
                              >
                                <div className="flex items-center justify-between mb-2">
                                  <div 
                                    className="w-8 h-8 rounded-full flex items-center justify-center text-white font-medium text-sm"
                                    style={{ backgroundColor: color }}
                                  >
                                    {idx + 1}
                                  </div>
                                  <div className="flex items-center">
                                    <span className={`text-xl ${
                                      trend === 'up' ? 'text-green-500' : 
                                      trend === 'down' ? 'text-red-500' : 
                                      'text-gray-500'
                                    }`}>
                                      {trend === 'up' ? '↑' : trend === 'down' ? '↓' : '→'}
                                    </span>
                                  </div>
                                </div>
                                
                                <p className="font-medium text-gray-800 mb-1 line-clamp-2" title={option.option}>
                                  {option.option}
                                </p>
                                
                                <div className="mt-auto pt-2">
                                  <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2">
                                    <div 
                                      className="h-2.5 rounded-full" 
                                      style={{ width: `${percentage}%`, backgroundColor: color }}
                                    ></div>
                                  </div>
                                  
                                  <div className="flex justify-between items-center text-sm">
                                    <span className="text-gray-500">{option.votes} votes</span>
                                    <span className="font-bold" style={{ color }}>
                                      {percentage}%
                                    </span>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Data Visualization Section with improved UI */}
                      <div className="mb-6">
                        <h3 className="text-lg font-semibold text-gray-700 mb-3 flex items-center">
                          {chartType[poll._id] === 'bar' ? 
                            <BarChart2 className="mr-2 text-blue-500" size={18} /> :
                            <PieChartIcon className="mr-2 text-blue-500" size={18} />
                          }
                          Votes Distribution Chart
                        </h3>
                        
                        <div className="border rounded-lg p-4 bg-gray-50">
                          <ResponsiveContainer width="100%" height={350}>
                            {chartType[poll._id] === 'bar' ? (
                              <BarChart data={poll.options.map((opt, idx) => ({ 
                                name: opt.option,
                                votes: opt.votes,
                                fill: COLORS[idx % COLORS.length]
                              }))}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                <XAxis 
                                  dataKey="name" 
                                  tick={{ fontSize: 12 }}
                                  tickFormatter={(value) => value.length > 15 ? `${value.substring(0, 15)}...` : value}
                                />
                                <YAxis tick={{ fontSize: 12 }} />
                                <Tooltip 
                                  contentStyle={{ 
                                    backgroundColor: '#fff', 
                                    borderRadius: '8px', 
                                    boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                                    border: 'none'
                                  }}
                                  formatter={(value, name, props) => [`${value} votes (${calculateTrendPercentage(value, totalVotes)}%)`, 'Votes']}
                                  labelFormatter={(label) => `Option: ${label}`}
                                />
                                <Bar dataKey="votes" radius={[4, 4, 0, 0]}>
                                  {poll.options.map((_, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                  ))}
                                </Bar>
                              </BarChart>
                            ) : (
                              <PieChart>
                                <Pie
                                  data={poll.options.map((opt, idx) => ({ 
                                    name: opt.option,
                                    value: opt.votes,
                                    fill: COLORS[idx % COLORS.length]
                                  }))}
                                  cx="50%"
                                  cy="50%"
                                  innerRadius={60}
                                  outerRadius={140}
                                  fill="#8884d8"
                                  dataKey="value"
                                  labelLine={true}
                                  label={({ name, percent }) => `${name.length > 20 ? `${name.substring(0, 20)}...` : name}: ${(percent * 100).toFixed(0)}%`}
                                >
                                  {poll.options.map((_, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                  ))}
                                </Pie>
                                <Tooltip 
                                  formatter={(value) => [`${value} votes (${calculateTrendPercentage(value, totalVotes)}%)`, 'Votes']}
                                  contentStyle={{ 
                                    backgroundColor: '#fff', 
                                    borderRadius: '8px', 
                                    boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                                    border: 'none'
                                  }}
                                />
                                <Legend 
                                  layout="horizontal" 
                                  verticalAlign="bottom" 
                                  align="center"
                                  formatter={(value) => value.length > 25 ? `${value.substring(0, 25)}...` : value}
                                />
                              </PieChart>
                            )}
                          </ResponsiveContainer>
                        </div>
                      </div>
                      
                      {/* Summary Report with improved UI */}
                      <SummaryReport poll={poll} />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-white text-center py-16 rounded-lg shadow-md border border-gray-200">
            <div className="text-gray-400 mb-4">
              <AlertTriangle size={64} className="mx-auto" />
            </div>
            <p className="text-gray-700 text-xl font-medium mb-2">No poll results available</p>
            <p className="text-sm text-gray-500 mb-6 max-w-md mx-auto">
              {filterQuery ? 
                `No polls match the search term "${filterQuery}". Try a different search or clear the filter.` :
                'Create your first poll to see results here. Polls allow you to gather insights from your audience.'
              }
            </p>
            {filterQuery && (
              <button
                onClick={() => setFilterQuery('')}
                className="px-4 py-2 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition inline-flex items-center"
              >
                <RefreshCw size={16} className="mr-2" />
                Clear Search Filter
              </button>
            )}
          </div>
        )}
        
        {/* Footer Section */}
        <div className="mt-8 text-center text-sm text-gray-500 p-4 border-t border-gray-200">
          <p>Poll Dashboard &copy; {new Date().getFullYear()}</p>
          <p className="mt-1">Data updates in real-time as votes come in</p>
        </div>
      </div>

      {/* Modal Components */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={confirmDelete}
        message="Are you sure you want to delete this poll? This action cannot be undone and all vote data will be permanently lost."
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