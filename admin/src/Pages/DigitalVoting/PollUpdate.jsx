import React, { useState, useEffect } from 'react';
import axios from 'axios';

const PollUpdate = () => {
  const [polls, setPolls] = useState([]);
  const [selectedPoll, setSelectedPoll] = useState(null);
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState(['']);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch existing polls when component mounts
  useEffect(() => {
    const fetchPolls = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get('http://localhost:8001/api/polls');
        setPolls(response.data);
      } catch (error) {
        console.error('Error fetching polls:', error);
        alert('Failed to fetch polls');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPolls();
  }, []);

  // Load selected poll's details
  const handlePollSelect = (poll) => {
    setSelectedPoll(poll);
    setQuestion(poll.question);
    setOptions(poll.options);
  };

  const handleAddOption = () => {
    setOptions([...options, '']);
  };

  const handleOptionChange = (index, event) => {
    const newOptions = [...options];
    newOptions[index] = event.target.value;
    setOptions(newOptions);
  };

  const handleRemoveOption = (index) => {
    if (options.length > 1) {
      const newOptions = options.filter((_, i) => i !== index);
      setOptions(newOptions);
    }
  };

  const handleUpdatePoll = async () => {
    if (!selectedPoll) {
      alert('Please select a poll to update');
      return;
    }

    try {
      await axios.put(`http://localhost:8001/api/polls/${selectedPoll.id}`, { 
        question, 
        options 
      });
      alert('Poll updated successfully');
      
      // Refresh polls list
      const response = await axios.get('http://localhost:8001/api/polls');
      setPolls(response.data);
    } catch (error) {
      console.error('Error updating poll:', error);
      alert('Error updating poll');
    }
  };

  const handleDeletePoll = async () => {
    if (!selectedPoll) {
      alert('Please select a poll to delete');
      return;
    }

    if (window.confirm('Are you sure you want to delete this poll? This action cannot be undone.')) {
      try {
        await axios.delete(`http://localhost:8001/api/polls/${selectedPoll.id}`);
        alert('Poll deleted successfully');
        
        // Refresh polls list and reset selected poll
        const response = await axios.get('http://localhost:8001/api/polls');
        setPolls(response.data);
        setSelectedPoll(null);
        setQuestion('');
        setOptions(['']);
      } catch (error) {
        console.error('Error deleting poll:', error);
        alert('Error deleting poll');
      }
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-8 bg-white rounded-lg shadow-xl mt-10">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Update or Delete Polls</h1>
      
      {/* Polls List */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Select a Poll to Update
        </label>
        {isLoading ? (
          <div className="text-center text-gray-500">Loading polls...</div>
        ) : polls.length === 0 ? (
          <div className="text-center text-gray-500">No polls available</div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {polls.map((poll) => (
              <div 
                key={poll.id}
                onClick={() => handlePollSelect(poll)}
                className={`p-4 border rounded-lg cursor-pointer transition duration-200 ${
                  selectedPoll?.id === poll.id 
                    ? 'border-indigo-500 bg-indigo-50 shadow-md' 
                    : 'hover:border-indigo-300 hover:bg-gray-50'
                }`}
              >
                <h3 className="font-semibold text-gray-800 truncate">{poll.question}</h3>
                <p className="text-xs text-gray-500">{poll.options.length} options</p>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* Poll Update Form */}
      {selectedPoll && (
        <div className="mt-8">
          <div className="mb-6">
            <label htmlFor="question" className="block text-sm font-medium text-gray-700 mb-2">
              Poll Question
            </label>
            <input
              id="question"
              type="text"
              placeholder="Enter your updated question"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200"
            />
          </div>
          
          <div className="mb-6">
            <div className="flex justify-between items-center mb-3">
              <label className="block text-sm font-medium text-gray-700">Poll Options</label>
              <span className="text-xs text-gray-500">{options.length} options</span>
            </div>
            
            {options.map((option, index) => (
              <div key={index} className="flex items-center mb-3">
                <input
                  type="text"
                  placeholder={`Option ${index + 1}`}
                  value={option}
                  onChange={(e) => handleOptionChange(index, e)}
                  className="flex-grow p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveOption(index)}
                  className="ml-3 p-3 text-red-500 hover:text-red-700 focus:outline-none transition duration-200"
                  disabled={options.length <= 1}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <button
              type="button"
              onClick={handleAddOption}
              className="flex items-center justify-center p-3 bg-indigo-500 text-white font-medium rounded-lg hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition duration-200"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
              Add Option
            </button>
            
            <button
              type="button"
              onClick={handleUpdatePoll}
              className="flex-grow p-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition duration-200"
            >
              Update Poll
            </button>
            
            <button
              type="button"
              onClick={handleDeletePoll}
              className="flex-grow p-3 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition duration-200"
            >
              Delete Poll
            </button>
          </div>
          
          <div className="text-xs text-gray-500 italic">
            Select a poll to modify. You can update the question, add/remove options, or delete the entire poll.
          </div>
        </div>
      )}
    </div>
  );
};

export default PollUpdate;