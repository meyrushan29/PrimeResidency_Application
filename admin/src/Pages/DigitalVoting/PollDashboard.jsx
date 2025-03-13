import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';

const PollDashboard = () => {
  const [polls, setPolls] = useState([]);

  useEffect(() => {
    const fetchPollResults = async () => {
      try {
        const { data } = await axios.get('http://localhost:8000/api/polls');
        setPolls(data);
      } catch (error) {
        console.error('Error fetching poll results:', error);
      }
    };
    fetchPollResults();
  }, []);

  const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#ffbb28', '#0088FE', '#00C49F'];

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white rounded-lg shadow-md mt-10">
      <h1 className="text-3xl font-semibold text-gray-800 mb-6">Poll Results</h1>

      {polls.length > 0 ? (
        polls.map((poll, index) => (
          <div key={poll._id} className="mb-10 p-6 border border-gray-200 rounded-lg">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">{poll.question}</h2>
            
            {/* Bar Chart */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-600 mb-2">Votes Distribution</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={poll.options.map(opt => ({ name: opt.option, votes: opt.votes }))}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="votes" fill={COLORS[index % COLORS.length]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Pie Chart */}
            <div className="flex justify-center">
              <ResponsiveContainer width="60%" height={300}>
                <PieChart>
                  <Pie
                    data={poll.options.map(opt => ({ name: opt.option, value: opt.votes }))}
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    label
                  >
                    {poll.options.map((_, i) => (
                      <Cell key={`cell-${i}`} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        ))
      ) : (
        <p className="text-gray-500 text-center">No poll results available.</p>
      )}
    </div>
  );
};

export default PollDashboard;
