import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { DonationsProvider } from './context/DonationsContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <DonationsProvider>
      <App />
    </DonationsProvider>
  </StrictMode>,
)
