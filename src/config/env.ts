// src/config/env.ts
export const config = {
  apiUrl: import.meta.env.VITE_API_URL || 'https://streamingaccounts-backend.onrender.com/api',
  firebase: {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'AIzaSyAY3Xn-c21lu50mXhHW8MfnHWq81eRrkpw',
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'streamingaccounts-f2501.firebaseapp.com',
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'streamingaccounts-f2501',
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'streamingaccounts-f2501.firebasestorage.app',
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '865438265962',
    appId: import.meta.env.VITE_FIREBASE_APP_ID || '1:865438265962:web:cfe9ba7c1bf34fa6a91013'
  },
  stripe: {
    publishableKey: import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || 'pk_test_51RiMJFCiYMScPpy1tWvxGa8ZLBN1epgapu7aKjsk4czfLtpQ1zFwh73kjXdQTFFLmsfkpArQ59uNa9PkWvBly18i00FI2UmCTQ'
  },
  paypal: {
    clientId: import.meta.env.VITE_PAYPAL_CLIENT_ID || 'demo-paypal-client'
  }
};
