// Firebase configuration
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyDTNcusxEXkjeNXV_hlQw_FcBNDMKYQETM",
  authDomain: "hotel-booking-system-webapp.firebaseapp.com",
  projectId: "hotel-booking-system-webapp",
  storageBucket: "hotel-booking-system-webapp.appspot.com",
  messagingSenderId: "893007337591",
  appId: "1:893007337591:web:your-app-id", // Get from Firebase Console if available
  // measurementId: "G-XXXXXXXXXX" // optional
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;
