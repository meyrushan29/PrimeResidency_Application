// src/Components/PrivateRoute.jsx

import React from 'react';
import { Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const PrivateRoute = ({ element, allowedRoles, ...props }) => {
  const { userRole } = useAuth();

  if (!userRole) {
    return <Navigate to="/login" />;
  }

  if (!allowedRoles.includes(userRole)) {
    return <Navigate to="/" />;
  }

  return <Route {...props} element={element} />;
};

export default PrivateRoute;
