
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

/**
 * STARTUP SECURITY VALIDATION
 * In a secure production environment, the API_KEY is managed as a server-side secret.
 * This check ensures that the environment is correctly initialized before the app starts.
 */
if (!import.meta.env.VITE_GEMINI_API_KEY) {
  const rootElement = document.getElementById('root');
  if (rootElement) {
    rootElement.innerHTML = `
      <div style="height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center; font-family: 'Inter', sans-serif; text-align: center; padding: 2rem; background: #fff;">
        <div style="background: #fef2f2; border: 1px solid #fee2e2; padding: 2rem; border-radius: 1.5rem; max-width: 480px; box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1);">
          <div style="width: 4rem; height: 4rem; background: #ef4444; color: white; border-radius: 1rem; display: flex; align-items: center; justify-content: center; margin: 0 auto 1.5rem;">
            <i class="fa-solid fa-shield-halved" style="font-size: 1.5rem;"></i>
          </div>
          <h1 style="color: #991b1b; font-size: 1.5rem; font-weight: 800; margin-bottom: 1rem;">Configuration Error</h1>
          <p style="color: #7f1d1d; line-height: 1.6; font-weight: 500;">
            The Gemini API Key is missing from the .env.local file. 
            The application has been halted for security reasons.
          </p>
          <div style="margin-top: 1.5rem; padding-top: 1.5rem; border-top: 1px solid #fee2e2; color: #991b1b; font-size: 0.75rem; font-weight: 700; letter-spacing: 0.05em; text-transform: uppercase;">
            Status: UNAUTHORIZED_ENVIRONMENT
          </div>
        </div>
      </div>
    `;
  }
  throw new Error("SEC_HALT: VITE_GEMINI_API_KEY is missing in .env.local. Aborting bootstrap.");
}

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
    