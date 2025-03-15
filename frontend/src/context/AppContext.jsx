import { createContext, useState } from 'react';

// Create a Context for global state management
export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const backendUrl = 'http://localhost:8001'; // Update this with your backend URL

  return (
    <AppContext.Provider value={{ backendUrl, token, setToken }}>
      {children}
    </AppContext.Provider>
  );
};
