import React, { createContext, useContext, useState, useEffect } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { collection, addDoc } from 'firebase/firestore';
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
      // Convert transfer proof file to base64 if it exists
      let transferProofData = null;
      if (bookingData.transferProof) {
        transferProofData = await new Promise((resolve) => {
          const reader = new FileReader();
          reader.onload = (e) => resolve({
            name: bookingData.transferProof.name,
            size: bookingData.transferProof.size,
            type: bookingData.transferProof.type,
            data: e.target.result // base64 string
          });
          reader.readAsDataURL(bookingData.transferProof);
        });
      }

      // Save booking data to Firestore
      await addDoc(collection(db, 'bookings'), {
        room: bookingData.room,
        action: bookingData.action,
        checkInDate: bookingData.checkInDate,
        checkInTime: bookingData.checkInTime,
        subtotal: bookingData.subtotal,
        tax: bookingData.tax,
        total: bookingData.total,
        originBank: bookingData.originBank,
        senderName: bookingData.senderName,
        transferProof: transferProofData,
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
