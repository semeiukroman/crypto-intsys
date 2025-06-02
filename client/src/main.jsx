import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import axios from 'axios';

const saved = localStorage.getItem('token');
if (saved) {
  axios.defaults.headers.common['Authorization'] = `Bearer ${saved}`;
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
