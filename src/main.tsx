import React from 'react';
import ReactDOM from 'react-dom/client';
import { HashRouter } from 'react-router-dom';
import { EcomitProvider } from './context/EcomitContext';
import { App } from './App';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <HashRouter>
      <EcomitProvider>
        <App />
      </EcomitProvider>
    </HashRouter>
  </React.StrictMode>
);
