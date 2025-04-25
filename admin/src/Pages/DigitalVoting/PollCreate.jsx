import React, { useState, useEffect } from 'react';
import axios from 'axios';

const PollCreate = () => {
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState(['', '']);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState({ visible: false, type: '', message: '' });

  // Handle toast timeout and dismissal
  useEffect(() => {
    let toastTimer;
    if (toast.visible) {
      toastTimer = setTimeout(() => {
        setToast({ ...toast, visible: false });
      }, 5000);
    }
    return () => clearTimeout(toastTimer);
  }, [toast]);

  const showToast = (type, message) => {
    setToast({ visible: true, type, message });
  };

  const dismissToast = () => {
    setToast({ ...toast, visible: false });
  };

  const handleAddOption = () => {
    setOptions([...options, '']);
  };

  const handleOptionChange = (index, event) => {
    const newOptions = [...options];
    newOptions[index] = event.target.value;
    setOptions(newOptions);
    
    // Clear error for this specific option if it exists
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
      
      // Clear error for removed option
      const newErrors = {...errors};
      delete newErrors[`option-${index}`];
      setErrors(newErrors);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    // Validate question
    if (!question.trim()) {
      newErrors.question = 'Question is required';
    }
    
    // Validate options (must have at least 2 options and no empty options)
    let validOptions = 0;
    options.forEach((option, index) => {
      if (!option.trim()) {
        newErrors[`option-${index}`] = 'Option cannot be empty';
      } else {
        validOptions++;
      }
    });
    
    if (validOptions < 2) {
      newErrors.options = 'At least 2 valid options are required';
    }
    
    // Check for duplicate options
    const uniqueOptions = new Set(options.filter(opt => opt.trim()));
    if (uniqueOptions.size !== options.filter(opt => opt.trim()).length) {
      newErrors.duplicate = 'Duplicate options are not allowed';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      showToast('error', 'Please fix the errors before submitting');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      await axios.post('http://localhost:8001/api/polls/create', { 
        question, 
        options: options.filter(opt => opt.trim()) 
      });
      
      showToast('success', 'Poll created successfully!');
      
      // Reset form after success
      setQuestion('');
      setOptions(['', '']);
      
    } catch {
      showToast('error', 'Error creating poll. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleQuestionChange = (e) => {
    setQuestion(e.target.value);
    if (errors.question) {
      const newErrors = {...errors};
      delete newErrors.question;
      setErrors(newErrors);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-xl relative">
      {/* Toast Notification */}
      {toast.visible && (
        <div 
          className={`fixed top-6 right-6 z-50 flex items-center p-4 mb-4 w-full max-w-xs rounded-lg shadow-lg ${
            toast.type === 'success' ? 'bg-green-500 text-white' : 
            toast.type === 'error' ? 'bg-red-500 text-white' : 
            toast.type === 'warning' ? 'bg-yellow-500 text-white' : 
            'bg-blue-500 text-white'
          } transition-opacity duration-300 ease-in-out`}
          role="alert"
        >
          <div className="inline-flex items-center justify-center flex-shrink-0 w-8 h-8 rounded-lg bg-opacity-20 bg-white">
            {toast.type === 'success' && (
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
              </svg>
            )}
            {toast.type === 'error' && (
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path>
              </svg>
            )}
            {toast.type === 'warning' && (
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd"></path>
              </svg>
            )}
            {toast.type === 'info' && (
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2h.01a1 1 0 100-2H9z" clipRule="evenodd"></path>
              </svg>
            )}
          </div>
          <div className="ml-3 text-sm font-medium">{toast.message}</div>
          <button 
            type="button" 
            onClick={dismissToast}
            className="ml-auto -mx-1.5 -my-1.5 bg-white text-gray-400 hover:text-gray-900 rounded-lg p-1.5 hover:bg-gray-100 inline-flex items-center justify-center h-8 w-8"
            aria-label="Close"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path>
            </svg>
          </button>
        </div>
      )}

      <h1 className="text-3xl font-bold text-gray-800 mb-6">Create a New Poll</h1>
      
      <div className="mb-6">
        <label htmlFor="question" className="block text-sm font-medium text-gray-700 mb-2">
          Poll Question <span className="text-red-500">*</span>
        </label>
        <input
          id="question"
          type="text"
          placeholder="Enter your question here"
          value={question}
          onChange={handleQuestionChange}
          className={`w-full p-3 border ${errors.question ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200`}
          aria-describedby={errors.question ? "question-error" : undefined}
        />
        {errors.question && (
          <p id="question-error" className="mt-1 text-sm text-red-600">{errors.question}</p>
        )}
      </div>
      
      <div className="mb-6">
        <div className="flex justify-between items-center mb-3">
          <label className="block text-sm font-medium text-gray-700">
            Poll Options <span className="text-red-500">*</span>
          </label>
          <span className="text-xs text-gray-500">{options.filter(opt => opt.trim()).length} valid options added</span>
        </div>
        
        {errors.options && (
          <p className="mb-3 text-sm text-red-600">{errors.options}</p>
        )}
        
        {errors.duplicate && (
          <p className="mb-3 text-sm text-red-600">{errors.duplicate}</p>
        )}
        
        {options.map((option, index) => (
          <div key={index} className="flex items-center mb-3">
            <div className="w-8 text-center text-gray-500">{index + 1}</div>
            <div className="flex-grow">
              <input
                type="text"
                placeholder={`Option ${index + 1}`}
                value={option}
                onChange={(e) => handleOptionChange(index, e)}
                className={`w-full p-3 border ${errors[`option-${index}`] ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200`}
                aria-describedby={errors[`option-${index}`] ? `option-error-${index}` : undefined}
              />
              {errors[`option-${index}`] && (
                <p id={`option-error-${index}`} className="mt-1 text-sm text-red-600">{errors[`option-${index}`]}</p>
              )}
            </div>
            <button
              type="button"
              onClick={() => handleRemoveOption(index)}
              className={`ml-3 p-2 rounded-full text-gray-400 hover:bg-gray-100 hover:text-red-500 focus:outline-none transition duration-200 ${options.length <= 2 ? 'opacity-50 cursor-not-allowed' : ''}`}
              disabled={options.length <= 2}
              aria-label="Remove option"
              title={options.length <= 2 ? "At least 2 options required" : "Remove this option"}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        ))}
        
        <button
          type="button"
          onClick={handleAddOption}
          className="mt-2 w-full flex items-center justify-center p-2 border border-dashed border-gray-300 rounded-lg text-indigo-600 hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition duration-200"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
          Add Another Option
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <button
          type="button"
          onClick={handleSubmit}
          disabled={isSubmitting}
          className={`flex-grow p-4 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition duration-200 ${isSubmitting ? 'opacity-75 cursor-not-allowed' : ''}`}
        >
          {isSubmitting ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Creating Poll...
            </>
          ) : (
            'Create Poll'
          )}
        </button>
      </div>
      
      <div className="bg-gray-50 p-4 rounded-lg text-sm text-gray-600">
        <p className="font-medium mb-2">📝 Poll Guidelines:</p>
        <ul className="list-disc pl-5 space-y-1">
          <li>Your poll question should be clear and specific</li>
          <li>A minimum of 2 options is required</li>
          <li>Each option must be unique</li>
          <li>All fields marked with <span className="text-red-500">*</span> are required</li>
        </ul>
      </div>
    </div>
  );
};

export default PollCreate;