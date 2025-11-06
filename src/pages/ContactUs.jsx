import React, { useState } from 'react';
import emailjs from '@emailjs/browser';
import '../components/ContactUs.css';
import Header from '../components/header.jsx';
import Footer from '../components/footer.jsx';

const ContactUs = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    emailAddress: '',
    subject: '',
    message: ''
  });
  const [notification, setNotification] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const templateParams = {
      from_name: formData.fullName,
      from_email: formData.emailAddress,
      subject: formData.subject,
      message: formData.message,
    };

    emailjs.send(
      'service_x2awk85',
      'template_0ohf3sh',
      templateParams,
      'F6PuIsVEAi-UV6Bvl'

      
    ).then((result) => {
      console.log(result.text);
      setNotification({ type: 'success', message: 'Message sent successfully!' });
      setFormData({ fullName: '', emailAddress: '', subject: '', message: '' });
      setTimeout(() => setNotification(null), 5000); // Clear notification after 5 seconds
    }, (error) => {
      console.log(error.text);
      setNotification({ type: 'error', message: 'Failed to send message. Please try again.' });
      setTimeout(() => setNotification(null), 5000); // Clear notification after 5 seconds
    });
  };

  return (
    <div className="contact-us-page">
      <Header />
      <main className="contact-us-main">
        <section className="contact-us-hero">
          <h1 className="contact-us-title">Contact Us</h1>
          <p className="contact-us-subtitle">We'd love to hear from you! Reach out to us with any questions or feedback.</p>
        </section>

        <section className="contact-form-section">
          <div className="contact-form-container">
            <h2 className="form-title">Send us a Message</h2>
            <form className="contact-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="fullName">Full Name</label>
                <input type="text" id="fullName" placeholder="Enter your full name" value={formData.fullName} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label htmlFor="emailAddress">Email Address</label>
                <input type="email" id="emailAddress" placeholder="Enter your email" value={formData.emailAddress} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label htmlFor="subject">Subject</label>
                <input type="text" id="subject" placeholder="Enter your subject" value={formData.subject} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label htmlFor="message">Message</label>
                <textarea id="message" rows="5" placeholder="Enter your message" value={formData.message} onChange={handleChange} required></textarea>
              </div>
              {notification && (
                <div className={`notification ${notification.type}`}>
                  {notification.message}
                </div>
              )}
              <button type="submit" className="send-message-btn">Send Message</button>
            </form>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default ContactUs;
