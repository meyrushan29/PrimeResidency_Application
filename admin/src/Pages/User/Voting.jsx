import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Voting = () => {
  const [polls, setPolls] = useState([]);
  const [selectedOptions, setSelectedOptions] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedPoll, setExpandedPoll] = useState(null);
  const [submitting, setSubmitting] = useState({});

  useEffect(() => {
    const fetchPolls = async () => {
      setIsLoading(true);
      try {
        const { data } = await axios.get('http://localhost:8001/api/polls');
        setPolls(data);
        setError(null);
      } catch {
        setError('Failed to load polls. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchPolls();
  }, []);

  const handleOptionSelect = (pollId, optionId) => {
    setSelectedOptions({
      ...selectedOptions,
      [pollId]: optionId,
    });
  };

  const handleVote = async (pollId) => {
    if (!selectedOptions[pollId]) {
      // Use a more elegant notification instead of alert
      showNotification('error', 'Please select an option first');
      return;
    }

    setSubmitting({ ...submitting, [pollId]: true });

    try {
      const response = await axios.post(
        'http://localhost:8001/api/polls/vote',
        {
          pollId,
          optionId: selectedOptions[pollId],
        }
      );

      const updatedPolls = polls.map((poll) => {
        if (poll._id === pollId) {
          return { ...poll, hasVoted: true };
        }
        return poll;
      });

      setPolls(updatedPolls);
      showNotification('success', response.data.message || 'Vote cast successfully');
    } catch (error) {
      showNotification('error', error.response ? error.response.data.message : error.message);
    } finally {
      setSubmitting({ ...submitting, [pollId]: false });
    }
  };

  const showNotification = (type, message) => {
    // In a real app, use a toast notification library
    // For now we'll use alert just so it's functional
    if (type === 'error') {
      alert(`⚠️ ${message}`);
    } else {
      alert(`✅ ${message}`);
    }
  };

  const togglePollExpansion = (pollId) => {
    setExpandedPoll(expandedPoll === pollId ? null : pollId);
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg mt-8">
        <div className="animate-pulse space-y-8">
          <div className="h-10 w-1/2 bg-gray-200 rounded mb-6"></div>
          {[1, 2, 3].map((index) => (
            <div key={index} className="border border-gray-100 rounded-lg p-4">
              <div className="h-6 w-3/4 bg-gray-200 rounded mb-4"></div>
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-12 bg-gray-100 rounded"></div>
                ))}
              </div>
              <div className="h-12 w-full bg-gray-200 rounded mt-4"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg mt-8">
        <div className="text-center p-6 bg-red-50 rounded-lg border border-red-100">
          <div className="mb-4 inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-red-700 mb-2">Unable to Load Polls</h2>
          <p className="text-red-600 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (polls.length === 0) {
    return (
      <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg mt-8">
        <div className="text-center p-8">
          <div className="mb-4 inline-flex items-center justify-center w-20 h-20 rounded-full bg-blue-50">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-3">No Active Polls</h2>
          <p className="text-gray-600 max-w-md mx-auto mb-6">There are currently no polls available for voting. Check back later for new polls.</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 mx-auto"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
            </svg>
            Refresh
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg mt-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Active Polls</h1>
        <p className="text-gray-600">Select an option and submit your vote for each poll</p>
      </header>

      <div className="space-y-6">
        {polls.map((poll) => (
          <div 
            key={poll._id} 
            className={`border rounded-lg overflow-hidden transition-all duration-300 ${
              poll.hasVoted ? 'border-green-200 bg-green-50' : 'border-gray-200 hover:border-blue-200'
            } ${expandedPoll === poll._id ? 'shadow-md' : 'shadow-sm'}`}
          >
            <div 
              onClick={() => togglePollExpansion(poll._id)}
              className={`p-4 flex justify-between items-center cursor-pointer ${
                poll.hasVoted ? 'bg-green-50' : 'bg-gradient-to-r from-blue-50 to-indigo-50'
              }`}
            >
              <div className="flex items-center gap-3">
                {poll.hasVoted && (
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
                <h2 className="text-lg font-semibold text-gray-800">{poll.question}</h2>
              </div>
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className={`h-5 w-5 text-gray-500 transition-transform ${expandedPoll === poll._id ? 'transform rotate-180' : ''}`}
                viewBox="0 0 20 20" 
                fill="currentColor"
              >
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </div>

            <div className={`transition-all duration-300 overflow-hidden ${expandedPoll === poll._id ? 'max-h-96' : 'max-h-0'}`}>
              <div className="p-5 border-t border-gray-200">
                <div className="space-y-3 mb-6">
                  {poll.options.map((option) => (
                    <label
                      key={option._id}
                      className={`flex items-center p-4 rounded-lg cursor-pointer transition-all duration-200
                        ${poll.hasVoted && selectedOptions[poll._id] === option._id
                          ? 'bg-green-100 border-2 border-green-500'
                          : selectedOptions[poll._id] === option._id
                            ? 'bg-blue-50 border-2 border-blue-500'
                            : 'bg-gray-50 hover:bg-gray-100 border-2 border-transparent'
                        } ${poll.hasVoted ? 'cursor-default' : 'cursor-pointer'}`}
                    >
                      <div className="relative">
                        <input
                          type="radio"
                          id={option._id}
                          name={poll._id}
                          value={option._id}
                          checked={selectedOptions[poll._id] === option._id}
                          onChange={() => !poll.hasVoted && handleOptionSelect(poll._id, option._id)}
                          disabled={poll.hasVoted}
                          className="h-5 w-5 text-blue-600 focus:ring-blue-500"
                        />
                        {poll.hasVoted && selectedOptions[poll._id] === option._id && (
                          <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-white" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          </div>
                        )}
                      </div>
                      <span className={`ml-3 font-medium ${
                        poll.hasVoted && selectedOptions[poll._id] === option._id
                          ? 'text-green-700'
                          : 'text-gray-700'
                      }`}>{option.option}</span>
                    </label>
                  ))}
                </div>
                
                <button
                  onClick={() => handleVote(poll._id)}
                  disabled={poll.hasVoted || !selectedOptions[poll._id] || submitting[poll._id]}
                  className={`w-full py-3 px-4 flex justify-center items-center gap-2 rounded-lg font-medium transition-all duration-200
                    ${poll.hasVoted
                      ? 'bg-green-100 text-green-700 cursor-default'
                      : submitting[poll._id]
                        ? 'bg-blue-400 text-white cursor-wait'
                        : selectedOptions[poll._id]
                          ? 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
                          : 'bg-gray-200 text-gray-500 cursor-not-allowed'}`}
                >
                  {poll.hasVoted ? (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span>Vote Recorded</span>
                    </>
                  ) : submitting[poll._id] ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span>Submitting...</span>
                    </>
                  ) : (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 1.414L10.586 9H7a1 1 0 100 2h3.586l-1.293 1.293a1 1 0 101.414 1.414l3-3a1 1 0 000-1.414z" clipRule="evenodd" />
                      </svg>
                      <span>Submit Vote</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Quick status for collapsed polls */}
            {expandedPoll !== poll._id && (
              <div className="px-4 py-2 text-sm border-t border-gray-200">
                <span className={poll.hasVoted ? 'text-green-600' : selectedOptions[poll._id] ? 'text-blue-600' : 'text-gray-500'}>
                  {poll.hasVoted ? 'Voted' : selectedOptions[poll._id] ? 'Option selected - Ready to vote' : 'No option selected'}
                </span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Voting;