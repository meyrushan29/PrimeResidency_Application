import React, { useState } from 'react';
import axios from 'axios';

const PollCreate = () => {
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState(['']);

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

  const handleSubmit = async () => {
    try {
      await axios.post('http://localhost:8001/api/polls/create', { question, options });
      alert('Poll created successfully');
    } catch (error) {
      alert('Error creating poll');
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-8 bg-white rounded-lg shadow-xl mt-10">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Create a New Poll</h1>
      
      <div className="mb-6">
        <label htmlFor="question" className="block text-sm font-medium text-gray-700 mb-2">Poll Question</label>
        <input
          id="question"
          type="text"
          placeholder="Enter your question here"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200"
        />
      </div>
      
      <div className="mb-6">
        <div className="flex justify-between items-center mb-3">
          <label className="block text-sm font-medium text-gray-700">Poll Options</label>
          <span className="text-xs text-gray-500">{options.length} options added</span>
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
          onClick={handleSubmit}
          className="flex-grow p-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition duration-200"
        >
          Create Poll
        </button>
      </div>
      
      <div className="text-xs text-gray-500 italic">
        All fields are required. You need at least one option to create a poll.
      </div>
    </div>
  );
};

export default PollCreate;