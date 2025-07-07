import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getAuth } from 'firebase-admin/auth';
import { getStorage } from 'firebase-admin/storage';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables first
dotenv.config({ path: path.join(__dirname, '..', '..', '.env') });

export const initializeFirebase = () => {
  // Check if Firebase is already initialized
  if (getApps().length === 0) {
    try {
      // Clear any system-level GOOGLE_APPLICATION_CREDENTIALS that might interfere
      delete process.env.GOOGLE_APPLICATION_CREDENTIALS;
      
      // Check if we have all required environment variables
      if (process.env.FIREBASE_PROJECT_ID && 
          process.env.FIREBASE_CLIENT_EMAIL && 
          process.env.FIREBASE_PRIVATE_KEY) {
        
        const serviceAccount = {
          projectId: process.env.FIREBASE_PROJECT_ID,
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
          privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
        };
        
        initializeApp({
          credential: cert(serviceAccount),
          storageBucket: `${process.env.FIREBASE_PROJECT_ID}.firebasestorage.app`,
        });
        
        console.log('✅ Firebase Admin initialized successfully');
      }
      // Fallback: Demo mode
      else {
        console.warn('⚠️  Firebase credentials not found or incomplete.');
        console.warn('⚠️  Check backend/.env file for all required variables.');
        
        initializeApp({
          projectId: 'demo-project',
        });
        
        console.log('⚠️  Running in DEMO mode - data won\'t persist');
      }

    } catch (error) {
      console.error('❌ Firebase initialization failed:', error);
      throw error;
    }
  }
};

// Initialize Firebase first
initializeFirebase();

// Firebase services
export const db = getFirestore();
export const auth = getAuth();
export const storage = getStorage();

// Configure Firestore settings
db.settings({
  ignoreUndefinedProperties: true
});
