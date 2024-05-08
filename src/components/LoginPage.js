import React, { useState } from 'react';
import {
  Box, Input, Button, Heading, VStack, useToast
} from '@chakra-ui/react';
import { BASE_URL } from '../secret';
function LoginPage({ onLoginSuccess }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const toast = useToast();

  const handleLogin = async () => {
    try {
      const response = await fetch(`${BASE_URL}/login-user`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password })
      });
  
      if (!response.ok) {
        toast({
          title: "Error",
          description: "Invalid Credentials",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
        return; // Stop execution if the login fails
      }
  
      const { accessToken } = await response.json();
      localStorage.setItem('token', accessToken); // Store the token
  
      // Display success toast
      toast({
        title: "Logged In",
        description: "You have successfully logged in.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
  
      // Use a timeout to delay the state update until the toast is shown
      setTimeout(() => {
        onLoginSuccess();
      }, 500); // Delay the redirection slightly to ensure user sees the message
      
    } catch (error) {
      toast({
        title: "Login Failed",
        description: error.message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };
  

  return (
    <VStack spacing={4} align="stretch">
      <Box p={5} shadow="md" borderWidth="1px" borderRadius="md">
        <Heading mb={6}>Login</Heading>
       
        <Input
          placeholder="admin@mail.com"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          mb={3}
        />
        <Input
          placeholder="admin"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          mb={6}
        />
        <Button colorScheme="blue" onClick={handleLogin}>Login</Button>
      </Box>
    </VStack>
  );
}

export default LoginPage;
