import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { WidgetPage } from './pages/WidgetPage';
import App from './App.tsx';
import './index.css';

// Check if this is the widget page
const isWidget = window.location.pathname === '/widget';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {isWidget ? <WidgetPage /> : <App />}
  </StrictMode>
);
