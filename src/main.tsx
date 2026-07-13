import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { ensureDemoOrder } from './lib/demoOrder';
import './index.css';

ensureDemoOrder();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);