import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from '../firebase';
import './Login.css'; // Custom Login styles
import Header from '../components/header.jsx';
import Footer from '../components/footer.jsx';

const Login = () => {
  const navigate = useNavigate();
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      navigate('/dashboard');
    } catch (error) {
      console.error('Google sign-in error:', error);
      setLoginError('Google sign-in failed. Please try again.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;

    if (!email) {
      setEmailError('Email is required');
      setPasswordError('');
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError('Invalid email format');
      setPasswordError('');
    } else if (!password) {
      setPasswordError('Password is required');
      setEmailError('');
    } else if (password.length < 6) {
      setPasswordError('Password must be at least 6 characters');
      setEmailError('');
    } else {
      setEmailError('');
      setPasswordError('');
      setLoginError('');
      setIsLoading(true);

      try {
        await signInWithEmailAndPassword(auth, email, password);
        navigate('/dashboard');
      } catch (error) {
        setLoginError('Login failed. Please try again.');
        if (error.code === 'auth/user-not-found') {
          setEmailError('Account not found');
        } else if (error.code === 'auth/wrong-password') {
          setPasswordError('Invalid password');
        }
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
          <h2 className="login-title">Login</h2>
      <form className="login-form" onSubmit={handleSubmit}>
            <div className="login-group">
              <label className="login-label" htmlFor="email">Email Address</label>
              <input type="email" id="email" name="email" className="login-input" placeholder="Enter your email" disabled={isLoading} />
              {emailError && <span className="error-message">{emailError}</span>}
            </div>
            <div className="login-group">
              <label className="login-label" htmlFor="password">Password</label>
              <input type="password" id="password" name="password" className="login-input" placeholder="Enter your password" disabled={isLoading} />
              {passwordError && <span className="error-message">{passwordError}</span>}
            </div>
            {loginError && <p className="login-message">{loginError}</p>}
            <button type="submit" className="login-btn" style={isLoading ? { background: 'green', pointerEvents: 'none' } : {}}>
              {isLoading ? 'Signing in...' : 'Sign In'}
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
            Sign in with Google
          </button>
          <div className="login-link">
            Don't have an account? <a href="/register">Register</a>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Login;
