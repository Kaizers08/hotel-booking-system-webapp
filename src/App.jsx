import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/home';
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
        <Route path="/contact" element={<ContactUs />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </Router>
  );
}

export default App
