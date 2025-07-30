import React from "react";
import "./Contact.css";

const Contact = () => {
  return (
    <div className="contact-container">
      <div className="contact-info">
        <h1>
          <strong>Business Buddy India Digital Marketing Solution Pvt. Ltd.</strong>
        </h1>
        <p><span className="icon">📞</span> +91 73 59 38 20 25</p>
        <p><span className="icon">✉️</span> Help @ businessbuddyindia.com</p>
        <p>
          <span className="icon">📍</span> D 103, Ganesh Glory 11,Gota, Ahmedabad , 382481
        </p>
      </div>

      <div className="subscribe">
        <h3>Connect with Us</h3>
        <label htmlFor="email">Email *</label>
        <input type="email" id="email" placeholder="Your Email" />
        <button>Send Request</button>
        <p className="stay-connected">Stay Connected</p>
      </div>
    </div>
  );
};

export default Contact;
