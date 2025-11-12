import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import './legacy/index.css';

// Força voltar ao login ao iniciar (remove quaisquer tokens salvos)
try {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
  sessionStorage.removeItem('accessToken');
  sessionStorage.removeItem('refreshToken');
} catch {}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
