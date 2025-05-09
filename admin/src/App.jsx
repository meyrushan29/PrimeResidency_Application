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
import PollUpdate from './Pages/DigitalVoting/PollUpdate';
import AddOwner from './Pages/HomeOwnerDetails/AddOwner';
import EditOwner from './Pages/HomeOwnerDetails/EditOnwer';
import OwnerServices from './Pages/Services/OwnerServices';
import CleaningForm from './Pages/Services/CleaningForm';
import HealthForm from './Pages/Services/HealthForm';
import FoodForm from './Pages/Services/FoodForm';
import AllBookings from './Pages/Bookings/AllBookings';
import MyServices from './Pages/Services/MyServices';
import SecurityForm from './Pages/Services/SecurityForm';
import LaundryForm from './Pages/Services/LaundryForm';
import MaintenanceForm from './Pages/Services/MaintenanceForm';
import ManageHomeOwner from './Pages/HomeOwnerDetails/ManageHomeOwner';

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
      } catch {
        // If token is invalid, clear localStorage and redirect to login
        localStorage.removeItem('token');
        setUserRole(null); // Ensure state is cleared
        navigate('/login');
      }
    } else {
      setUserRole(null); // Clear userRole if no token
      navigate('/login');
    }
  }, [navigate]);

  const handleLogout = () => {
    // Clear user data from localStorage
    localStorage.removeItem('token');
    // Reset userRole state
    setUserRole(null);
    // Redirect to login page
    navigate('/login');
  };

  return (
    <div className="flex flex-col h-screen">
      {userRole ? (
        <>
          <NavBar onLogout={handleLogout} />
          <div className="flex flex-1 overflow-hidden">
            <SideBar />
            <main className="flex-1 p-6 overflow-auto">
              <Routes>
                {userRole === 'user' && (
                  <>
                    <Route path="/register" element={<VotersRegister />} />
                    <Route path="/voting" element={<Voting />} />
                    <Route path="/ownerserevices" element={<OwnerServices />} />
                    <Route path="/cleaningform" element={<CleaningForm />} />
                    <Route path="/healthform" element={<HealthForm />} />
                    <Route path="/Myservices" element={<MyServices />} />
                    <Route path="/foodform" element={<FoodForm />} />
                    <Route path="/securityform" element={<SecurityForm />} />
                    <Route path="/laundryform" element={<LaundryForm />} />
                    <Route path="/maintenanceform" element={<MaintenanceForm />} />
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
                    <Route path="/pollupdate/:id" element={<PollUpdate />} />
                    <Route path="/addowner" element={<AddOwner />} />
                    <Route path="/adbookings" element={<AllBookings />} />
                    <Route path="/manageowner" element={<ManageHomeOwner />} />
                    <Route path="/edit-owner/:id" element={<EditOwner />} />
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
