import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { initSecurityGuardian } from './services/securityGuard'

// Initialize Anti-Tamper & Security Shield
initSecurityGuardian();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
