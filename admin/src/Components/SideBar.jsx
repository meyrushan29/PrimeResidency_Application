import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const SideBar = () => {
  const [isVotingExpanded, setIsVotingExpanded] = useState(false);
  const { userRole } = useAuth(); // Access the userRole from context

  return (
    <div className="w-64 h-screen bg-gray-100 p-4 border-r border-gray-200 shadow-sm">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-800">Dashboard</h2>
      </div>
      <nav>
        <ul className="space-y-2">
          {userRole === 'admin' && (
            // Admin-specific links
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
          )}

          {userRole === 'user' && (
            // User-specific links
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

          {/* Any other links (hidden or not accessible) */}
          {userRole !== 'admin' && (
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
