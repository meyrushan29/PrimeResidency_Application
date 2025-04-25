import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const NavBar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [role, setRole] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Retrieve token and role from localStorage
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');

    if (token && role) {
      setIsLoggedIn(true);
      setRole(role);
    } else {
      setIsLoggedIn(false);
      setRole('');
    }

    console.log('useEffect called: token:', token, 'role:', role); // Debug log
  }, []); // This only runs once when the component mounts

  const handleLogout = () => {
    try {
      // Clear authentication data
      localStorage.removeItem('token');
      localStorage.removeItem('role');
  
      // Reset React state
      setIsLoggedIn(false);
      setRole('');
  
      console.log('Logged out: token removed', localStorage.getItem('token'), localStorage.getItem('role'));
  
      // Navigate to login page immediately after logout
      navigate('/login', { replace: true });
    } catch (error) {
      console.error('Error during logout:', error);
      alert('Logout failed. Please try again.');
    }
  };

  // Conditionally set the background color based on the role and login state
  const navBgColor = isLoggedIn ? (role === 'admin' ? 'bg-blue-950' : 'bg-sky-950') : 'bg-gray-800';

  return (
    <nav className={`px-4 py-3 flex items-center justify-between shadow-md ${navBgColor}`}>
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
