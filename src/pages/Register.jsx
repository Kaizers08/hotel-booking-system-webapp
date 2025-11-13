import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup, updateProfile } from 'firebase/auth';
import { auth, db } from '../firebase';
import { collection, addDoc } from 'firebase/firestore';
import './Login.css'; // Reuse Login styles
import Header from '../components/header.jsx';
import Footer from '../components/footer.jsx';

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Save Google user data to Firestore
      console.log('Saving Google user to Firestore:', {
        email: user.email,
        displayName: user.displayName,
        uid: user.uid
      });

      await addDoc(collection(db, 'users'), {
        email: user.email,
        displayName: user.displayName,
        uid: user.uid,
        createdAt: new Date()
      });

      console.log('Google user saved successfully');
      navigate('/dashboard');
    } catch (error) {
      console.error('Google sign-in error:', error);
      setErrors({ general: 'Google sign-in failed. Please try again.' });
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let newErrors = {};

    if (!formData.fullName) newErrors.fullName = 'Full name is required';
    if (!formData.email) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Invalid email format';
    if (!formData.password) newErrors.password = 'Password is required';
    else if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    if (!formData.confirmPassword) newErrors.confirmPassword = 'Confirm password is required';
    else if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      setIsLoading(true);
      try {
        // Create Firebase Auth account
        await createUserWithEmailAndPassword(auth, formData.email, formData.password);
        await updateProfile(auth.currentUser, { displayName: formData.fullName });

        console.log('Firebase Auth account created successfully');

        // Navigate to dashboard immediately after auth success
        navigate('/dashboard');

        // Save user data to Firestore in background (non-blocking)
        try {
          console.log('Saving email user to Firestore:', {
            email: formData.email,
            displayName: formData.fullName,
            uid: auth.currentUser.uid
          });

          await addDoc(collection(db, 'users'), {
            email: formData.email,
            displayName: formData.fullName,
            uid: auth.currentUser.uid,
            createdAt: new Date()
          });

          console.log('Email user saved to Firestore successfully');
        } catch (firestoreError) {
          console.error('Error saving user to Firestore:', firestoreError);
          // Note: User is already created and logged in, but data not saved to Firestore
          // This won't block the user experience
        }

      } catch (error) {
        console.error('Registration error:', error);
        if (error.code === 'auth/email-already-in-use') {
          newErrors.email = 'Email already in use';
        } else if (error.code === 'auth/weak-password') {
          newErrors.password = 'Password is too weak';
        } else {
          newErrors.email = 'Registration failed. Please try again.';
        }
        setErrors(newErrors);
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="login-page">
      <Header />
      <main className="login-main">
        <div className="login-card">
          <h2 className="login-title">Create Account</h2>
          <form className="login-form" onSubmit={handleSubmit}>
            <div className="login-group">
              <label className="login-label" htmlFor="fullName">Full Name</label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                className="login-input"
                placeholder="Enter your full name"
                value={formData.fullName}
                onChange={handleChange}
              />
              {errors.fullName && <span className="error-message">{errors.fullName}</span>}
            </div>
            <div className="login-group">
              <label className="login-label" htmlFor="email">Email Address</label>
              <input
                type="email"
                id="email"
                name="email"
                className="login-input"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
              />
              {errors.email && <span className="error-message">{errors.email}</span>}
            </div>
            <div className="login-group">
              <label className="login-label" htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                className="login-input"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
              />
              {errors.password && <span className="error-message">{errors.password}</span>}
            </div>
            <div className="login-group">
              <label className="login-label" htmlFor="confirmPassword">Confirm Password</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                className="login-input"
                placeholder="Confirm your password"
                value={formData.confirmPassword}
                onChange={handleChange}
              />
              {errors.confirmPassword && <span className="error-message">{errors.confirmPassword}</span>}
            </div>
            <button
              type="submit"
              className="login-btn"
              disabled={isLoading}
              style={isLoading ? { background: 'green', pointerEvents: 'none' } : {}}
            >
              {isLoading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>
          <div className="or-text">or</div>
          <button className="google-btn" onClick={handleGoogleSignIn}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Sign up with Google
          </button>
          <div className="login-link">
            Already have an account? <a href="/login">Login</a>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Register;
