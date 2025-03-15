import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const NavBar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Manage login state
  const [role, setRole] = useState(''); // Store role to determine if admin or user
  const navigate = useNavigate();

  // Check localStorage on component mount (useEffect will run once)
  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');

    if (token && role) {
      setIsLoggedIn(true);  // User is logged in
      setRole(role);  // Set the role from localStorage
    } else {
      setIsLoggedIn(false); // User is logged out
      setRole(''); // Clear role if not logged in
    }

    console.log('useEffect called: token:', token, 'role:', role); // Debug log
  }, []); // Empty dependency to only run on component mount

  const handleLogout = () => {
    try {
      // Clear authentication data from localStorage
      localStorage.removeItem('token');
      localStorage.removeItem('role');

      // Update React state to reflect the logout
      setIsLoggedIn(false); // Log the user out by setting state
      setRole(''); // Clear the role

      // Add a console log to verify if logout is working
      console.log('LocalStorage after logout:', 
        'token:', localStorage.getItem('token'), 
        'role:', localStorage.getItem('role')
      );
      
      // Navigate to the login page without page refresh
      navigate('/login', { replace: true });

      // Force a refresh or clean-up if needed (optional)
      window.location.reload();
    } catch (error) {
      console.error('Error during logout:', error);
      alert('Logout failed. Please try again.');
    }
  };

  return (
    <nav className={`px-4 py-3 flex items-center justify-between shadow-md ${isLoggedIn ? (role === 'admin' ? 'bg-blue-950' : 'bg-sky-950') : 'bg-gray-800'}`}>
      <div className="flex items-center">
        <span className="text-white font-bold text-xl">
          {isLoggedIn ? (role === 'admin' ? 'Admin Dashboard' : 'Welcome User') : 'Logo'}
        </span>
      </div>
      <div className="flex space-x-6">
        
        {isLoggedIn && (
          <button
            onClick={handleLogout}
            className="text-gray-300 hover:text-white transition-colors"
            type="button"
          >
            Logout
          </button>
        )}
      </div>
    </nav>
  );
};

export default NavBar;
