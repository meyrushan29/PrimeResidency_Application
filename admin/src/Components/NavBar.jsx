import React from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate to handle navigation

const NavBar = () => {
  const navigate = useNavigate(); // Get navigate function to redirect to login

  const handleLogout = () => {
    // Clear user authentication state (e.g., userRole from localStorage or context)
    localStorage.removeItem('userRole'); // Clear the role from localStorage
    // Redirect to login page after logging out
    navigate('/login');
  };

  return (
    <nav className="bg-gray-800 px-4 py-3 flex items-center justify-between shadow-md">
      <div className="flex items-center">
        <span className="text-white font-bold text-xl">Logo</span>
      </div>
      <div className="flex space-x-6">
        <a href="#" className="text-gray-300 hover:text-white transition-colors">Home</a>
        <button
          onClick={handleLogout}
          className="text-gray-300 hover:text-white transition-colors"
        >
          Logout
        </button>
      </div>
    </nav>
  );
};

export default NavBar;
