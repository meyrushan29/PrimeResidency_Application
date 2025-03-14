/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Voting = () => {
  const [polls, setPolls] = useState([]);
  const [selectedOptions, setSelectedOptions] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPolls = async () => {
      setIsLoading(true);
      try {
        const { data } = await axios.get('http://localhost:8001/api/polls');
        setPolls(data);
        setError(null);
      } catch (error) {
        console.error('Error fetching polls');
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
      [pollId]: optionId
    });
  };

  const handleVote = async (pollId) => {
    if (!selectedOptions[pollId]) {
      alert('Please select an option first');
      return;
    }
    
    try {
      await axios.post('http://localhost:8001/api/polls/vote', {
        pollId,
        optionId: selectedOptions[pollId]
      });
      
      // Update UI to show vote was successful
      const updatedPolls = polls.map(poll => {
        if (poll._id === pollId) {
          return { ...poll, hasVoted: true };
        }
        return poll;
      });
      
      setPolls(updatedPolls);
      alert('Vote cast successfully');
    } catch (error) {
      alert('Error voting');
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto p-8 bg-white rounded-lg shadow-xl mt-10 text-center">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-8 w-2/3 bg-gray-200 rounded mb-6"></div>
          <div className="h-32 w-full bg-gray-100 rounded mb-4"></div>
          <div className="h-32 w-full bg-gray-100 rounded"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-8 bg-white rounded-lg shadow-xl mt-10">
        <div className="text-center p-6 bg-red-50 rounded-lg border border-red-100">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-red-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h2 className="text-xl font-bold text-red-700 mb-2">Error</h2>
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  if (polls.length === 0) {
    return (
      <div className="max-w-4xl mx-auto p-8 bg-white rounded-lg shadow-xl mt-10">
        <div className="text-center p-6">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          <h2 className="text-xl font-bold text-gray-700 mb-2">No polls available</h2>
          <p className="text-gray-500">Check back later for new polls to vote on.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-8 bg-white rounded-lg shadow-xl mt-10">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Active Polls</h1>
      
      <div className="space-y-6">
        {polls.map((poll) => (
          <div 
            key={poll._id} 
            className="border border-gray-200 rounded-lg overflow-hidden transition-all duration-200 hover:shadow-md"
          >
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-800">{poll.question}</h2>
            </div>
            
            <div className="p-6">
              <div className="space-y-3 mb-6">
                {poll.options.map((option) => (
                  <label
                    key={option._id}
                    className={`flex items-center p-3 rounded-lg cursor-pointer transition-all duration-150
                      ${selectedOptions[poll._id] === option._id
                        ? 'bg-blue-50 border-2 border-blue-500'
                        : 'bg-gray-50 hover:bg-gray-100 border-2 border-transparent'}`}
                  >
                    <input
                      type="radio"
                      id={option._id}
                      name={poll._id}
                      value={option._id}
                      checked={selectedOptions[poll._id] === option._id}
                      onChange={() => handleOptionSelect(poll._id, option._id)}
                      className="h-5 w-5 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-3 text-gray-700 font-medium">{option.option}</span>
                  </label>
                ))}
              </div>
              
              <button
                onClick={() => handleVote(poll._id)}
                disabled={poll.hasVoted || !selectedOptions[poll._id]}
                className={`w-full py-3 px-4 flex justify-center items-center gap-2 rounded-lg font-medium transition-all duration-200
                  ${poll.hasVoted 
                    ? 'bg-green-100 text-green-700 cursor-default'
                    : selectedOptions[poll._id]
                      ? 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
                      : 'bg-gray-200 text-gray-500 cursor-not-allowed'}`}
              >
                {poll.hasVoted ? (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Vote Recorded
                  </>
                ) : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
                    </svg>
                    Submit Vote
                  </>
                )}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Voting;