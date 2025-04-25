import React, { createContext, useState, useEffect } from 'react';

// Create AuthContext
export const AuthContext = createContext();

// AuthProvider component to manage authentication state
export const AuthProvider = ({ children }) => {
  const [userRole, setUserRole] = useState(null); // Store the user role
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Store authentication state
  const [isLoading, setIsLoading] = useState(true); // Loading state while checking token

  useEffect(() => {
    const token = localStorage.getItem('jwtToken'); // Get token from localStorage
    if (token) {
      try {
        const decodedToken = JSON.parse(atob(token.split('.')[1])); // Decode JWT
        setUserRole(decodedToken.role); // Set user role
        setIsAuthenticated(true); // Set authenticated state to true
      } catch (error) {
        console.error('Error decoding token:', error);
        localStorage.removeItem('jwtToken'); // Remove token if it's invalid
        setIsAuthenticated(false); // Set authenticated state to false
      }
    } else {
      setIsAuthenticated(false); // If no token, set authenticated state to false
    }
    setIsLoading(false); // Stop loading once token check is complete
  }, []);

  // Login handler
  const login = (token) => {
    localStorage.setItem('jwtToken', token); // Store the token in localStorage
    const decodedToken = JSON.parse(atob(token.split('.')[1])); // Decode JWT to get the user role
    setUserRole(decodedToken.role); // Set the user role
    setIsAuthenticated(true); // Set authenticated state to true
  };

  // Logout handler
  const logout = () => {
    localStorage.removeItem('jwtToken'); // Remove the token from localStorage
    setUserRole(null); // Clear user role
    setIsAuthenticated(false); // Set authenticated state to false
  };

  return (
    <AuthContext.Provider value={{ userRole, isAuthenticated, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
