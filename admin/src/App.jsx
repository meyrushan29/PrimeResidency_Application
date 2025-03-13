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

const App = () => {
  const { userRole } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!userRole) {
      navigate('/login');
    }
  }, [userRole, navigate]);

  return (
    <div className="flex flex-col h-screen">
      {userRole ? (
        <>
          <NavBar />
          <div className="flex flex-1 overflow-hidden">
            <SideBar />
            <main className="flex-1 p-6 overflow-auto">
              <Routes>
                <Route path="/" element={<h2 className="text-2xl">Home Page</h2>} />
                {userRole === 'user' && (
                  <>
                    <Route path="/register" element={<VotersRegister />} />
                    <Route path="/voting" element={<Voting />} />
                  </>
                )}
                {userRole === 'admin' && (
                  <>
                    <Route path="/manage" element={<VotersManagement />} />
                    <Route path="/pollcreate" element={<PollCreate />} />
                    <Route path="/polldashboard" element={<PollDashboard />} />
                  </>
                )}
                <Route path="*" element={<Navigate to="/" />} />
              </Routes>
            </main>
          </div>
        </>
      ) : (
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      )}
    </div>
  );
};

function AppWrapper() {
  return (
    <AuthProvider>
      <Router>
        <App />
      </Router>
    </AuthProvider>
  );
}

export default AppWrapper;
