import React, { useState, useEffect } from 'react';
import { ChakraProvider } from '@chakra-ui/react';
import LoginPage from './components/LoginPage';
import HomePage from './components/HomePage';
import { BASE_URL } from "./secret";
function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const token = localStorage.getItem('token');
  useEffect(() => {
    
    if (token) {
      verifyToken(token);
    }
  }, [token]);

  const handleLogout = () => {
    localStorage.removeItem('token'); // Remove the stored JWT token
    setLoggedIn(false); // Update the loggedIn state to false
  };

  const verifyToken = async (token) => {
    // Example endpoint that verifies the token
    const response = await fetch(`${BASE_URL}/verify-token`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    if (response.ok) {
      setLoggedIn(true);
    } else {
      localStorage.removeItem('token'); // remove invalid token
      setLoggedIn(false);
    }
  };

  const handleLoginSuccess = () => {
    setLoggedIn(true);
  };

  return (
    <ChakraProvider>
      {!loggedIn ? (
        <LoginPage onLoginSuccess={handleLoginSuccess} />
      ) : (
        <HomePage onLogout={handleLogout}/>
      )}
    </ChakraProvider>
  );
}

export default App;
