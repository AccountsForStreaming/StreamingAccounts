import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { PayPalScriptProvider } from '@paypal/react-paypal-js'
import './index.css'
import App from './App.tsx'

const paypalOptions = {
  clientId: import.meta.env.VITE_PAYPAL_CLIENT_ID || '',
  currency: 'EUR',
  intent: 'capture',
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <PayPalScriptProvider options={paypalOptions}>
      <App />
    </PayPalScriptProvider>
  </StrictMode>,
)
