import React from 'react'
import googleplay from '../assets/googleplay.png'
import appstore from '../assets/appstore.jpg'
import logo from '../assets/logo.png'
import facebook from '../assets/facebook.png'
import instagram from '../assets/instagram.jpg'
import linkedin from '../assets/linkedin.png'
import twitter from '../assets/twitter.png'
import youtube from '../assets/youtube.png'

const Footer = () => {
    return (
        <>
            <div>
                <footer className="footer">
                    <div className="footer-top">
                        <div className="footer-left">
                            <div className="logo">
                                <img src={logo} className="logo-img" />
                                <span className="logo-text">MetaGold</span>
                            </div>
                            <p className="footer-desc">
                                MetaGold, a platform used to encourage Tradings habits in Indians by helping them Trade on a daily basis.
                            </p>
                            <div className="social-icons">
                                <img src={facebook} alt="Facebook" />
                                <img src={instagram} alt="Instagram" />
                                <img src={linkedin} alt="LinkedIn" />
                                <img src={twitter} alt="Twitter" />
                                <img src={youtube} alt="YouTube" />
                            </div>

                            <div className="app-buttons">
                                <img src={googleplay} alt="" />
                                <img src={appstore} alt="" />
                            </div>
                        </div>

                        <div className="footer-links">
                            <div>
                                <h4>MetaGold</h4>
                                <ul>
                                    <li className="disabled">Homepage</li>
                                    <li>About us</li>
                                    <li>Daily Savings</li>
                                    <li>Round-offs</li>
                                    <li>Careers</li>
                                </ul>
                            </div>
                            <div>
                                <h4>Explore</h4>
                                <ul>
                                    <li>What is 24k Gold?</li>
                                    <li>Check Gold Price</li>
                                    <li>FAQs</li>
                                    <li>Blogs</li>
                                    <li>Instant Loan</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    <hr className="divider" />

                    <div className="footer-bottom">
                        <div className="address">
                            <h4>Address</h4>
                            <p>
                                D-103, Ganesh Glory 11, Gota, Ahmedabad, 382481
                            </p>
                        </div>
                        <div className="bottom-links">
                            <a href="#">Contact Support</a>
                            <a href="#">Privacy policy</a>
                            <a href="#">ISMS Policy</a>
                            <a href="#">Terms of use</a>
                        </div>
                    </div>

                    <hr className="divider" />

                    <p className="copyright">
                        ©BusinessBuddy®India Pvt.Ltd.
                    </p>
                </footer>
            </div>
        </>
    )
}

export default Footer
