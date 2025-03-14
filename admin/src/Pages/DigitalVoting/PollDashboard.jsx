import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';

const PollDashboard = () => {
  const [polls, setPolls] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPollData = async () => {
      try {
        // Fetch current poll data
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
                          <span className={`text-xl ${
                            trend === 'up' ? 'text-green-500' : 
                            trend === 'down' ? 'text-red-500' : 'text-gray-500'
                          }`}>
                            {getTrendIcon(trend)}
                          </span>
                          <span className={`ml-1 text-sm ${
                            trend === 'up' ? 'text-green-500' : 
                            trend === 'down' ? 'text-red-500' : 'text-gray-500'
                          }`}>
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
    </div>
  );
};

export default PollDashboard;