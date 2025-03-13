import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // Import useAuth to access userRole

const NavBar = () => {
  const navigate = useNavigate();
  const { setUserRole } = useAuth(); // Use setUserRole from context

  const handleLogout = () => {
    localStorage.removeItem('userRole'); // Remove the userRole from localStorage
    setUserRole(null); // Reset the userRole state to null
    navigate('/login'); // Redirect to the login page
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
