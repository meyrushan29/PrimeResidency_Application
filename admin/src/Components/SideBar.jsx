import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const SideBar = () => {
  const [isVotingExpanded, setIsVotingExpanded] = useState(false);
  const [isHomeExpanded, setIsHomeExpanded] = useState(false);
  const [userRole, setUserRole] = useState(null); // Store the user role directly
  const [isLoading, setIsLoading] = useState(true); // Loading state for role fetching

  const navigate = useNavigate();

  // Get user role from localStorage when the component mounts
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decodedToken = JSON.parse(atob(token.split('.')[1])); // Decode JWT token
        if (decodedToken && decodedToken.role) {
          setUserRole(decodedToken.role); // Set the role from the token
        } else {
          throw new Error('Invalid role in token');
        }
      } catch (error) {
        localStorage.removeItem('token');
        navigate('/login');
      }
    } else {
      navigate('/login');
    }
    setIsLoading(false); // Stop loading after checking the role
  }, [navigate]);

  if (isLoading) {
    return <div>Loading...</div>; // Render loading state until role is determined
  }

  return (
    <div className="w-64 h-screen bg-gray-100 p-4 border-r border-gray-200 shadow-sm">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-800">Dashboard</h2>
      </div>
      <nav>
        <ul className="space-y-2">
          {/* Admin Role Sidebar */}
          {userRole === 'admin' && (
            <>
              <li>
                <button
                  onClick={() => setIsVotingExpanded(!isVotingExpanded)}
                  className="w-full flex items-center justify-between p-2 text-gray-700 rounded hover:bg-gray-200 hover:text-gray-900 transition-all"
                >
                  <div className="flex items-center">
                    <span className="mr-3">🗳️</span>
                    <span>Digital Voting</span>
                  </div>
                  <span className="text-sm">{isVotingExpanded ? '▼' : '►'}</span>
                </button>

                {isVotingExpanded && (
                  <ul className="ml-6 mt-2 space-y-1">
                    <li>
                      <Link to="/manage" className="flex items-center p-2 text-gray-600 rounded hover:bg-gray-200 hover:text-gray-900 transition-all">
                        <span className="mr-2">•</span>
                        <span>Voters Management</span>
                      </Link>
                    </li>
                    <li>
                      <Link to="/pollcreate" className="flex items-center p-2 text-gray-600 rounded hover:bg-gray-200 hover:text-gray-900 transition-all">
                        <span className="mr-2">•</span>
                        <span>Poll Create</span>
                      </Link>
                    </li>
                    <li>
                      <Link to="/polldashboard" className="flex items-center p-2 text-gray-600 rounded hover:bg-gray-200 hover:text-gray-900 transition-all">
                        <span className="mr-2">•</span>
                        <span>Poll Dashboard</span>
                      </Link>
                    </li>
                  </ul>
                )}
              </li>

              <li>
                <button
                  onClick={() => setIsHomeExpanded(!isHomeExpanded)}
                  className="w-full flex items-center justify-between p-2 text-gray-700 rounded hover:bg-gray-200 hover:text-gray-900 transition-all"
                >
                  <div className="flex items-center">
                    <span className="mr-3">🏠</span>
                    <span>Available Home</span>
                  </div>
                  <span className="text-sm">{isHomeExpanded ? '▼' : '►'}</span>
                </button>

                {isHomeExpanded && (
                  <ul className="ml-6 mt-2 space-y-1">
                    <li>
                      <Link to="/avhome" className="flex items-center p-2 text-gray-600 rounded hover:bg-gray-200 hover:text-gray-900 transition-all">
                        <span className="mr-2">•</span>
                        <span>Add Home</span>
                      </Link>
                    </li>
                    <li>
                      <Link to="/manageaddhome" className="flex items-center p-2 text-gray-600 rounded hover:bg-gray-200 hover:text-gray-900 transition-all">
                        <span className="mr-2">•</span>
                        <span>Manage Home</span>
                      </Link>
                    </li>
                  </ul>
                )}
              </li>
            </>
          )}

          {/* User Role Sidebar */}
          {userRole === 'user' && (
            <li>
              <button
                onClick={() => setIsVotingExpanded(!isVotingExpanded)}
                className="w-full flex items-center justify-between p-2 text-gray-700 rounded hover:bg-gray-200 hover:text-gray-900 transition-all"
              >
                <div className="flex items-center">
                  <span className="mr-3">🗳️</span>
                  <span>Digital Voting</span>
                </div>
                <span className="text-sm">{isVotingExpanded ? '▼' : '►'}</span>
              </button>

              {isVotingExpanded && (
                <ul className="ml-6 mt-2 space-y-1">
                  <li>
                    <Link to="/register" className="flex items-center p-2 text-gray-600 rounded hover:bg-gray-200 hover:text-gray-900 transition-all">
                      <span className="mr-2">•</span>
                      <span>Voter Registration</span>
                    </Link>
                  </li>
                  <li>
                    <Link to="/voting" className="flex items-center p-2 text-gray-600 rounded hover:bg-gray-200 hover:text-gray-900 transition-all">
                      <span className="mr-2">•</span>
                      <span>Voting</span>
                    </Link>
                  </li>
                </ul>
              )}
            </li>
          )}

          {/* Handle unauthorized or invalid roles */}
          {(userRole !== 'admin' && userRole !== 'user') && (
            <li>
              <Link to="#" className="flex items-center p-2 text-gray-600 rounded bg-gray-300 cursor-not-allowed">
                <span className="mr-2">•</span>
                <span>No Access</span>
              </Link>
            </li>
          )}
        </ul>
      </nav>
    </div>
  );
};

export default SideBar;
