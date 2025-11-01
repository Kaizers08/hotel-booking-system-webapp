import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/home';
import Dashboard from './pages/Dashboard'; // Import the Dashboard page
import PaymentMethod from './pages/PaymentMethod'; // Import the PaymentMethod page
import PaymentInstruction from './pages/PaymentInstruction'; // Import the PaymentInstruction page
import PaymentCompleted from './pages/PaymentCompleted'; // Import the PaymentCompleted page
import ContactUs from './pages/ContactUs'; // Import the new ContactUs page
import Login from './pages/Login'; // Import the new Login page
import Register from './pages/Register'; // Import the new Register page

import Footer from './components/footer';
import WhyChooseUs from './components/WhyChooseUs';
import Header from './components/header'; // Assuming you have a Header component

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={
          <>
            <Header />
            <Home />
            <WhyChooseUs />
            <Footer />
          </>
        } />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/payment-method" element={<PaymentMethod />} />
        <Route path="/payment-instruction" element={<PaymentInstruction />} />
        <Route path="/payment-completed" element={<PaymentCompleted />} />
        <Route path="/contact" element={<ContactUs />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </Router>
  );
}

export default App
