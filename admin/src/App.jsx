import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import NavBar from './Components/NavBar';
import SideBar from './Components/SideBar';
import VotersRegister from './Pages/User/VotersRegister';
import VotersManagement from './Pages/DigitalVoting/VotersManagement';
import Voting from './Pages/User/Voting';
import Login from './Pages/login,signup/Login';
import PollCreate from './Pages/DigitalVoting/PollCreate';
import PollDashboard from './Pages/DigitalVoting/PollDashboard';
import { AvHome } from './Pages/AvaiHome/AvHome';
import ManageHomeAdds from './Pages/AvaiHome/ManageHomeAdds';
import EditAvHome from './Pages/AvaiHome/EditAvHome';

const App = () => {
  const [userRole, setUserRole] = useState(null); // Manage user role state
  const navigate = useNavigate();  // Initialize navigate here

  // Check if the user is authenticated and get their role from the token in localStorage
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decodedToken = JSON.parse(atob(token.split('.')[1])); // Decode JWT
        setUserRole(decodedToken.role);
      } catch (error) {
        // If token is invalid, clear localStorage and redirect to login
        localStorage.removeItem('token');
        navigate('/login');
      }
    } else {
      navigate('/login');
    }
  }, [navigate]);

  return (
    <div className="flex flex-col h-screen">
      {userRole ? (
        <>
          <NavBar />
          <div className="flex flex-1 overflow-hidden">
            <SideBar />
            <main className="flex-1 p-6 overflow-auto">
              <Routes>
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
                    <Route path="/avhome" element={<AvHome />} />
                    <Route path="/manageaddhome" element={<ManageHomeAdds />} />
                    <Route path="/editavhome/:id" element={<EditAvHome />} />
                  </>
                )}
                <Route path="*" element={<Navigate to="/" />} />
              </Routes>
            </main>
          </div>
        </>
      ) : (
        <Routes>
          <Route path="/login" element={<Login onLoginSuccess={setUserRole} />} />
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      )}
    </div>
  );
};

function AppWrapper() {
  return (
    <Router>
      <App />
    </Router>
  );
}

export default AppWrapper;
