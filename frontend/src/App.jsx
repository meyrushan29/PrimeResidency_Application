import { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import Home from "./Pages/Home"; // ✅ Ensure correct path
import Navbar from './Components/Navbar';
import Footer from './Components/Footer';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Contact from './Pages/Contact';
import AvailableHome from './Pages/AvailableHome';
import Services from './Pages/Services';

function App() {
  return (
    <Router> {/* Ensure BrowserRouter wraps everything */}
       
        <ToastContainer />
        <Navbar />
        <Routes>
          <Route path='/' element={<Home />} /> 
          <Route path='/availablehome' element={<AvailableHome />} />
          <Route path='/services' element={<Services />} />
          <Route path='/contact' element={<Contact />} />
          
        </Routes>
        <Footer />
       
    </Router>
  );
}

export default App;
