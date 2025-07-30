import React from "react";
import "./Downloadable.css";
import taxImgs from '../assets/taxImgs.png' // Replace with actual path to your image
import loanImg from "../assets/loanImg.png"; // Replace with actual path to your image

const Downloadable = () => {
    return (
        <div className="download-container">
            <h2 className="resources-title">Resources</h2>
            <div className="card-wrapper">
                <div className="card">
                    <div className="card-image tax-card">
                        <img src={taxImgs} alt="Income Tax Calculator" />
                        <h3>Income Tax Calculator<br />FY 2025–26</h3>
                    </div>
                    <div className="card-content">
                        <p><strong>Income Tax Calculator</strong></p>
                        <button className="download-btn">Download</button>
                    </div>
                </div>

                <div className="card">
                    <div className="card-image loan-card">
                        <img src={loanImg} alt="Instant Loan" />
                        <h3>Ultimate Guide to Instant Loan</h3>
                    </div>
                    <div className="card-content">
                        <p><strong>Ultimate Guide to Instant Loan</strong></p>
                        <button className="download-btn">Download</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Downloadable;