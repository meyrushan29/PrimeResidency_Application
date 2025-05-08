import { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, useLocation } from 'react-router-dom';

import Home from "./Pages/Home";
import Navbar from './Components/Navbar';
import Footer from './Components/Footer';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Contact from './Pages/Contact';
import AvailableHome from './Pages/AvailableHome';
import Services from './Pages/Services';
import ViewOneHome from './Pages/ViewOneHome';
import Login from './Pages/Login';
import MyViewAppointments from './Pages/MyViewAppointments';
import EditBooking from './Pages/EditBooking';
import MyProfile from './Pages/MyProfile';

// Wrapper component to check current route
const MainLayout = ({ children }) => {
  const location = useLocation();
  const isLoginPage = location.pathname === '/login';
  
  return (
    <>
      {!isLoginPage && <Navbar />}
      {children}
      {!isLoginPage && <Footer />}
    </>
  );
};

function App() {
  // State to check if user is authenticated
  const [isAuthenticated, setIsAuthenticated] = useState(
    localStorage.getItem('token') ? true : false
  );

  return (
    <Router>
      <ToastContainer />
      
      <MainLayout>
        <Routes>
          {/* Redirect root path to login if not authenticated */}
          <Route path="/" element={
            isAuthenticated ? <Home /> : <Navigate to="/login" />
          } />
          
          {/* Login page is always accessible */}
          <Route path="/login" element={
            <Login setIsAuthenticated={setIsAuthenticated} />
          } />
          
          {/* Protected routes - only accessible when authenticated */}
          <Route path="/availablehome" element={
            isAuthenticated ? <AvailableHome /> : <Navigate to="/login" />
          } />
          <Route path="/services" element={
            isAuthenticated ? <Services /> : <Navigate to="/login" />
          } />
          <Route path="/contact" element={
            isAuthenticated ? <Contact /> : <Navigate to="/login" />
          } />
          <Route path="/viewonehome/:id" element={
            isAuthenticated ? <ViewOneHome /> : <Navigate to="/login" />
          } />
          <Route path="/my-appointments" element={
            isAuthenticated ? <MyViewAppointments /> : <Navigate to="/login" />
          } />
          <Route path="/edit-booking/:id" element={
            isAuthenticated ? <EditBooking /> : <Navigate to="/login" />
          } />
          <Route path="/myprofile" element={
            isAuthenticated ? <MyProfile /> : <Navigate to="/login" />
          } />
        </Routes>
      </MainLayout>
    </Router>
  );
}

export default App;