import React, { createContext, useContext, useState, useEffect } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, setDoc, collection, addDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const saveBooking = async (bookingData) => {
    if (!user) return;
    try {
      await addDoc(collection(db, 'bookings'), {
        ...bookingData,
        userId: user.uid,
        createdAt: new Date()
      });
      return 'Booking saved successfully';
    } catch (error) {
      console.error('Error saving booking:', error);
      throw new Error('Failed to save booking');
    }
  };

  const value = {
    user,
    logout,
    isAuthenticated: !!user,
    saveBooking,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
