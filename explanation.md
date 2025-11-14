# Hotel Booking System Webapp - Code Explanation

## Project Overview

This is a comprehensive hotel booking web application built with React and Firebase. The system allows users to browse hotel rooms, make reservations, and complete bookings through an online payment process. Administrators can manage rooms, view bookings, and handle user accounts through a dedicated dashboard.

## Technology Stack

- **Frontend Framework**: React 19.1.1 with Vite
- **Routing**: React Router DOM 7.9.4
- **Authentication**: Firebase Authentication
- **Database**: Firestore (Firebase)
- **Storage**: Firebase Storage (configured but not fully implemented)
- **Email Service**: EmailJS for notifications
- **Styling**: CSS with custom components
- **Build Tool**: Vite 7.1.7

## Project Structure

```
hotel-booking-system-webapp/
├── public/                          # Static assets
│   ├── qrcode.png                  # Payment QR code
│   ├── paymentcomplete.png         # Success image
│   └── [room images]               # Hotel room photos
├── src/
│   ├── components/                 # Reusable UI components
│   │   ├── header.jsx             # Navigation header
│   │   ├── footer.jsx             # Site footer
│   │   ├── FeaturedHotels.jsx     # Home page hotel showcase
│   │   ├── WhyChooseUs.jsx        # Benefits section
│   │   ├── DashboardHeader.jsx    # Dashboard navigation
│   │   └── [CSS files]            # Component styles
│   ├── contexts/
│   │   └── AuthContext.jsx        # Authentication state management
│   ├── pages/                     # Main application pages
│   │   ├── UserPortal.jsx         # Home page
│   │   ├── Login.jsx              # User login
│   │   ├── Register.jsx           # User registration
│   │   ├── BookingSystem.jsx      # Room browsing and booking
│   │   ├── AdminDashboard.jsx     # Admin management panel
│   │   ├── ContactUs.jsx          # Contact page
│   │   └── [CSS files]            # Page styles
│   ├── firebase.js                # Firebase configuration
│   ├── App.jsx                    # Main app component with routing
│   ├── main.jsx                   # Application entry point
│   └── index.css                  # Global styles
├── functions/                     # Firebase Cloud Functions (if any)
├── firebase.json                  # Firebase project configuration
├── goldtech-hotel.rules           # Firestore security rules
├── package.json                   # Dependencies and scripts
└── vite.config.js                 # Vite configuration
```

## Detailed Code Explanations

### Entry Point (main.jsx)
```javascript
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { AuthProvider } from './contexts/AuthContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </StrictMode>,
)
```
**Explanation**: Uses React 18's `createRoot` API for rendering. `StrictMode` enables additional development checks. `AuthProvider` wraps the entire app to provide authentication context globally.

### App Component (App.jsx)
```javascript
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import UserPortal from './pages/UserPortal';
import BookingSystem from './pages/BookingSystem';
import AdminDashboard from './pages/AdminDashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import ContactUs from './pages/ContactUs';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<UserPortal />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/contact" element={<ContactUs />} />
        <Route path="/dashboard" element={<BookingSystem />} />
        <Route path="/booking" element={<BookingSystem />} />
        <Route path="/admin" element={<AdminDashboard />} />
      </Routes>
    </Router>
  );
}
```
**Explanation**: Sets up client-side routing. Note that both `/dashboard` and `/booking` routes lead to the same `BookingSystem` component.

### Authentication System (AuthContext.jsx)
```javascript
const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const saveBooking = async (bookingData) => {
    if (!user) return;
    try {
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
        userEmail: user.email,
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
```
**Key Features**:
- Uses `onAuthStateChanged` to listen for authentication changes
- `saveBooking` converts file uploads to base64 for Firestore storage
- Prevents rendering children until auth state is determined (`!loading && children`)

### Login Component (Login.jsx)
```javascript
const handleSubmit = async (e) => {
  e.preventDefault();
  const email = e.target.email.value;
  const password = e.target.password.value;

  // Validation logic
  if (!email) {
    setEmailError('Email is required');
  } else if (!/\S+@\S+\.\S+/.test(email)) {
    setEmailError('Invalid email format');
  } else if (!password) {
    setPasswordError('Password is required');
  } else if (password.length < 6) {
    setPasswordError('Password must be at least 6 characters');
  } else {
    // Attempt login
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/dashboard');
    } catch (error) {
      if (error.code === 'auth/user-not-found') {
        setEmailError('Account not found');
      } else if (error.code === 'auth/wrong-password') {
        setPasswordError('Invalid password');
      }
    }
  }
};
```
**Google Sign-in Logic**:
```javascript
const handleGoogleSignIn = async () => {
  const provider = new GoogleAuthProvider();
  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;

    // Check if user exists in Firestore
    const q = query(usersRef, where('uid', '==', user.uid));
    const querySnapshot = await getDocs(q);

    // Save new Google users to Firestore
    if (querySnapshot.empty) {
      await addDoc(collection(db, 'users'), {
        email: user.email,
        displayName: user.displayName,
        uid: user.uid,
        createdAt: new Date()
      });
    }
    navigate('/dashboard');
  } catch (error) {
    setLoginError('Google sign-in failed. Please try again.');
  }
};
```

### Register Component (Register.jsx)
```javascript
const handleSubmit = async (e) => {
  e.preventDefault();

  // Form validation
  if (!formData.fullName) newErrors.fullName = 'Full name is required';
  if (!formData.email) newErrors.email = 'Email is required';
  else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Invalid email format';
  if (!formData.password) newErrors.password = 'Password is required';
  else if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
  if (!formData.confirmPassword) newErrors.confirmPassword = 'Confirm password is required';
  else if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';

  if (Object.keys(newErrors).length === 0) {
    try {
      // Create Firebase Auth account
      await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      await updateProfile(auth.currentUser, { displayName: formData.fullName });

      // Navigate immediately
      navigate('/dashboard');

      // Save to Firestore (non-blocking)
      await addDoc(collection(db, 'users'), {
        email: formData.email,
        displayName: formData.fullName,
        uid: auth.currentUser.uid,
        createdAt: new Date()
      });
    } catch (error) {
      if (error.code === 'auth/email-already-in-use') {
        newErrors.email = 'Email already in use';
      }
    }
  }
};
```
**Note**: User is navigated to dashboard immediately after Firebase Auth creation, while Firestore save happens in background.

### Header Component (header.jsx)
```javascript
const Header = () => {
  const { user, logout } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    checkAdminStatus();
  }, [user]);

  const checkAdminStatus = async () => {
    if (!user) return;

    const adminDoc = await getDocs(collection(db, 'admins'));
    const adminEmails = adminDoc.docs.map(doc => doc.data().email);
    setIsAdmin(adminEmails.includes(user.email));
  };

  const firstName = user?.displayName?.split(' ')[0] || user?.email.split('@')[0] || 'User';

  return (
    <header className="header">
      <div className="logo">GoldTech Hotel</div>
      <nav className="nav">
        <Link to="/" className="nav-link"> Home </Link>
        <Link to="/contact" className="nav-link"> Contact Us </Link>
        {user ? (
          <>
            <Link to="/dashboard" className="nav-link"> Dashboard </Link>
            {isAdmin && <Link to="/admin" className="nav-link"> Admin Panel </Link>}
            <span className="welcome-text">Welcome, {firstName}!</span>
            <button onClick={handleLogout} className="logout-btn">Logout</button>
          </>
        ) : (
          <Link to="/login" className="nav-link"> Login </Link>
        )}
      </nav>
    </header>
  );
};
```
**Admin Check**: Queries Firestore `admins` collection to determine if current user is admin.

### Booking System - Room Loading
```javascript
const loadRooms = async () => {
  try {
    const roomsSnapshot = await getDocs(collection(db, 'rooms'));
    const roomsData = roomsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    setRooms(roomsData);
  } catch (error) {
    console.error('Error loading rooms:', error);
  } finally {
    setLoading(false);
  }
};
```

### Booking System - Filtering Logic
```javascript
const filteredRooms = rooms.filter((room) => {
  const matchesFilter = () => {
    if (activeFilter === 'All') return true;
    if (activeFilter === 'Silver Tier') return room.category === 'Silver Tier';
    if (activeFilter === 'Gold Tier') return room.category === 'Gold Tier';
    // ... more filters
    return false;
  };

  const matchesSearch = room.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        room.details.toLowerCase().includes(searchTerm.toLowerCase());

  return matchesFilter() && matchesSearch;
});
```

### Booking System - Multi-Step State Management
```javascript
const [bookingStep, setBookingStep] = useState('browse'); // 'browse', 'payment-method', 'payment-instruction', 'completed'
const [bookingAction, setBookingAction] = useState('book'); // 'book' or 'reserve'
const [selectedRoom, setSelectedRoom] = useState(null);
```

### Admin Dashboard - Room CRUD Operations
```javascript
const handleRoomSubmit = async (e) => {
  e.preventDefault();

  try {
    const roomData = {
      ...roomForm,
      price: parseInt(roomForm.price),
      available: parseInt(roomForm.available)
    };

    if (editingRoom) {
      await updateDoc(doc(db, 'rooms', editingRoom.id), roomData);
      setRooms(rooms.map(room =>
        room.id === editingRoom.id ? { ...room, ...roomData } : room
      ));
    } else {
      const newRoomRef = doc(collection(db, 'rooms'));
      await setDoc(newRoomRef, roomData);
      setRooms([...rooms, { id: newRoomRef.id, ...roomData }]);
    }
  } catch (error) {
    console.error('Error saving room:', error);
  }
};
```

### Admin Dashboard - Admin Authorization
```javascript
const checkAdminStatus = async () => {
  if (!user) {
    navigate('/');
    return;
  }

  try {
    const adminDoc = await getDocs(collection(db, 'admins'));
    const adminEmails = adminDoc.docs.map(doc => doc.data().email);
    const userIsAdmin = adminEmails.includes(user.email);

    if (userIsAdmin) {
      setIsAdmin(true);
    } else {
      navigate('/');
    }
  } catch (error) {
    navigate('/');
  }
};
```

## Database Schema (Firestore)

### Collections:

#### `rooms`
```javascript
{
  id: "auto-generated",
  name: "Room Name",
  price: 5000, // number
  image: "base64-or-url",
  category: "Gold Tier", // Silver Tier, Gold Tier, Penthouse, Beach, Romance, Family
  details: "Room description",
  available: 5 // number of available rooms
}
```

#### `bookings`
```javascript
{
  id: "auto-generated",
  room: { name: "Room Name", ... },
  action: "book", // or "reserve"
  checkInDate: "2025-11-15",
  checkInTime: "14:00",
  subtotal: 5000,
  tax: 600,
  total: 5600,
  originBank: "GCash",
  senderName: "John Doe",
  transferProof: {
    name: "receipt.jpg",
    size: 1024000,
    type: "image/jpeg",
    data: "base64-string"
  },
  userId: "firebase-uid",
  userEmail: "user@example.com",
  createdAt: Timestamp
}
```

#### `admins`
```javascript
{
  id: "auto-generated",
  email: "admin@example.com"
}
```

#### `users`
```javascript
{
  id: "auto-generated",
  uid: "firebase-uid",
  email: "user@example.com",
  displayName: "John Doe",
  createdAt: Timestamp
}
```

## Booking Flow

1. **User Registration/Login**: Users must authenticate via Firebase Auth
2. **Room Selection**: Browse and filter available rooms
3. **Booking Initiation**: Choose "Book Now" or "Reserve Room"
4. **Payment Method Confirmation**: Confirm booking intent
5. **Payment Details**: Enter check-in date/time, upload transfer proof, provide sender info
6. **Payment Processing**: Scan QR code and complete bank transfer
7. **Booking Completion**: System saves booking to database
8. **Admin Review**: Administrators can view and manage bookings

## Authentication & Security

- **Firebase Authentication**: Email/password authentication
- **Protected Routes**: Booking system requires authentication
- **Admin Authorization**: Email-based admin checking
- **Firestore Rules**: Security rules defined in `goldtech-hotel.rules`

## Payment System

- **QR Code Payment**: Static QR code for bank transfers
- **Transfer Proof**: Image/PDF upload of payment confirmation
- **Tax Calculation**: 12% tax automatically added to room price
- **Manual Verification**: Admins review uploaded receipts

## Setup & Installation

1. **Clone Repository**:
   ```bash
   git clone <repository-url>
   cd hotel-booking-system-webapp
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Firebase Configuration**:
   - Create Firebase project
   - Enable Authentication, Firestore, Storage
   - Update `src/firebase.js` with your config
   - Deploy Firestore rules from `goldtech-hotel.rules`

4. **Environment Setup**:
   - Configure Firebase project ID in `.firebaserc`
   - Set up admin emails in Firestore `admins` collection

5. **Run Development Server**:
   ```bash
   npm run dev
   ```

6. **Build for Production**:
   ```bash
   npm run build
   npm run preview
   ```

## Additional Features

- **Email Notifications**: EmailJS integration for booking confirmations
- **Responsive Design**: Mobile-friendly interface
- **Image Management**: Room photos and receipt uploads
- **Real-time Updates**: Live data from Firestore
- **Search & Filter**: Advanced room discovery
- **Multi-step Forms**: Guided booking process

## Development Notes

- **Firebase Storage**: Currently uses local base64 encoding; requires billing setup for permanent storage
- **Admin Setup**: Manually add admin emails to Firestore `admins` collection
- **Room Images**: Stored as base64 in database; consider optimizing for production
- **Error Handling**: Basic error handling implemented; could be enhanced
- **Testing**: No test files included; consider adding unit/integration tests

## Future Enhancements

- Implement Firebase Storage for image hosting
- Add email confirmation system
- Implement real-time booking availability
- Add payment gateway integration
- Create mobile app version
- Add room availability calendar
- Implement review/rating system
- Add multi-language support

This documentation provides a comprehensive overview of the hotel booking system's architecture, functionality, and implementation details.
