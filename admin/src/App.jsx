// src/App.jsx

import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import NavBar from './Components/NavBar';
import SideBar from './Components/SideBar';
import VotersRegister from './Pages/User/VotersRegister';
import VotersManagement from './Pages/DigitalVoting/VotersManagement';
import Voting from './Pages/User/Voting';
import Login from './Pages/login,signup/Login';
import PollCreate from './Pages/DigitalVoting/PollCreate';
import PollDashboard from './Pages/DigitalVoting/PollDashboard';
import { AuthProvider, useAuth } from './context/AuthContext';

function App() {
  const { userRole } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // If the user is not logged in and tries to visit a restricted route, redirect to login
    if (!userRole) {
      navigate('/login');
    }
  }, [userRole, navigate]);

  return (
    <div className="flex flex-col h-screen">
      {/* Conditionally render NavBar and SideBar only if userRole exists */}
      {userRole && (
        <>
          <NavBar />
          <div className="flex flex-1 overflow-hidden">
            <SideBar />
            <main className="flex-1 p-6 overflow-auto">
              <Routes>
                {/* Home route */}
                <Route path="/" element={<h2 className="text-2xl">Home Page</h2>} />

                {/* Only User can access VotersRegister and Voting */}
                {userRole === 'user' && (
                  <>
                    <Route path="/register" element={<VotersRegister />} />
                    <Route path="/voting" element={<Voting />} />
                  </>
                )}

                {/* Admin can access PollCreate and PollDashboard */}
                {userRole === 'admin' && (
                  <>
                    <Route path="/manage" element={<VotersManagement />} />
                    <Route path="/pollcreate" element={<PollCreate />} />
                    <Route path="/polldashboard" element={<PollDashboard />} />
                  </>
                )}

                {/* Redirect all other cases to Home */}
                <Route path="*" element={<Navigate to="/" />} />
              </Routes>
            </main>
          </div>
        </>
      )}

      {/* If the user is not logged in, show the login page */}
      {!userRole && (
        <Routes>
          <Route path="/login" element={<Login />} />
          {/* Optionally redirect to the login page from other routes */}
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      )}
    </div>
  );
}

function AppWrapper() {
  return (
    <AuthProvider>
      {/* Wrap the entire app with Router to provide routing context */}
      <Router>
        <App />
      </Router>
    </AuthProvider>
  );
}

export default AppWrapper;
