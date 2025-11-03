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

export default App
