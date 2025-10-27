import React from 'react';
import '../components/ContactUs.css'; // We will create this CSS file next
import Header from '../components/header.jsx';
import Footer from '../components/footer.jsx';

const ContactUs = () => {
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
            <form className="contact-form">
              <div className="form-group">
                <label htmlFor="fullName">Full Name</label>
                <input type="text" id="fullName" placeholder="Enter your full name" />
              </div>
              <div className="form-group">
                <label htmlFor="emailAddress">Email Address</label>
                <input type="email" id="emailAddress" placeholder="Enter your email" />
              </div>
            <div className="form-group">
                <label htmlFor="subject">Subject</label>
                <input type="text" id="subject" placeholder="Enter your subject" />
              </div>
              <div className="form-group">
                <label htmlFor="message">Message</label>
                <textarea id="message" rows="5" placeholder="Enter your message"></textarea>
              </div>
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
