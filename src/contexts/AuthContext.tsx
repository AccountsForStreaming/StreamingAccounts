import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  signInWithPopup,
  updateProfile,
  type User as FirebaseUser,
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, googleProvider, db } from '../lib/firebase';
import type { User, AuthState } from '../types';

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, displayName: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  resetError: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AuthState>({
    user: null,
    loading: true,
    error: null,
  });

  const setError = (error: string) => {
    setState(prev => ({ ...prev, error, loading: false }));
  };

  const resetError = () => {
    setState(prev => ({ ...prev, error: null }));
  };

  const setLoading = (loading: boolean) => {
    setState(prev => ({ ...prev, loading }));
  };

  const setUser = (user: User | null) => {
    setState(prev => ({ ...prev, user, loading: false, error: null }));
  };

  // Convert Firebase user to our User type
  const convertFirebaseUser = async (firebaseUser: FirebaseUser): Promise<User> => {
    const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
    const userData = userDoc.data();

    return {
      id: firebaseUser.uid,
      email: firebaseUser.email!,
      displayName: firebaseUser.displayName || userData?.displayName || '',
      isAdmin: userData?.isAdmin || false,
      createdAt: userData?.createdAt?.toDate() || new Date(),
      updatedAt: userData?.updatedAt?.toDate() || new Date(),
    };
  };

  // Create or update user document in Firestore
  const createUserDocument = async (firebaseUser: FirebaseUser, additionalData: any = {}) => {
    const userRef = doc(db, 'users', firebaseUser.uid);
    const userDoc = await getDoc(userRef);

    if (!userDoc.exists()) {
      const userData = {
        email: firebaseUser.email,
        displayName: firebaseUser.displayName || additionalData.displayName || '',
        isAdmin: false,
        createdAt: new Date(),
        updatedAt: new Date(),
        ...additionalData,
      };

      await setDoc(userRef, userData);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      resetError();
      const result = await signInWithEmailAndPassword(auth, email, password);
      await createUserDocument(result.user);
      const user = await convertFirebaseUser(result.user);
      setUser(user);
    } catch (error: any) {
      setError(error.message);
    }
  };

  const register = async (email: string, password: string, displayName: string) => {
    try {
      setLoading(true);
      resetError();
      const result = await createUserWithEmailAndPassword(auth, email, password);
      
      // Update the user's display name
      await updateProfile(result.user, { displayName });
      
      // Create user document in Firestore
      await createUserDocument(result.user, { displayName });
      
      const user = await convertFirebaseUser(result.user);
      setUser(user);
    } catch (error: any) {
      setError(error.message);
    }
  };

  const loginWithGoogle = async () => {
    try {
      setLoading(true);
      resetError();
      const result = await signInWithPopup(auth, googleProvider);
      await createUserDocument(result.user);
      const user = await convertFirebaseUser(result.user);
      setUser(user);
    } catch (error: any) {
      setError(error.message);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      await signOut(auth);
      setUser(null);
    } catch (error: any) {
      setError(error.message);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          await createUserDocument(firebaseUser);
          const user = await convertFirebaseUser(firebaseUser);
          setUser(user);
        } catch (error: any) {
          setError(error.message);
        }
      } else {
        setUser(null);
      }
    });

    return unsubscribe;
  }, []);

  const value: AuthContextType = {
    ...state,
    login,
    register,
    loginWithGoogle,
    logout,
    resetError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
