import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { ChakraProvider } from '@chakra-ui/react';
import reportWebVitals from './reportWebVitals';
import { Provider } from 'react-redux';
import store from './store/store';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Provider store={store}>
   <ChakraProvider>
    <App />
  </ChakraProvider>,
  </Provider>
  </React.StrictMode>
);


reportWebVitals();