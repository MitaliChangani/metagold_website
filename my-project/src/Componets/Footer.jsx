import React from 'react'
import googleplay from '../assets/googleplay.png'
import appstore from '../assets/appstore.png'
import logo from '../assets/logo.png'
import facebook from '../assets/facebook.png'
import instagram from '../assets/instagram.png'
import linkedin from '../assets/linkedin.png'
import twitter from '../assets/twitter.png'
import youtube from '../assets/youtube.png'

function Footer() {
    return (

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
                            <a href="https://www.instagram.com/businessbuddyindia_in?igsh=MTF4b2J1MW9xaGJpcA=="><img src={instagram} alt="Instagram"/></a>
                            <img src={linkedin} alt="LinkedIn" />
                            <img src={twitter} alt="Twitter" className='twit' />
                            <img src={youtube} alt="YouTube" className='you'/>
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
                                <a href="/About1"><li>Homepage</li></a>
                                <a href="/About2"><li>About us</li></a>
                                <a href="/About1"><li>Daily Savings</li></a>
                                <a href="/About1"><li>Round-offs</li></a>
                                <a href="/About1"><li>Careers</li></a>
                            </ul>
                        </div>
                        <div>
                            <h4>Explore</h4>
                            <ul>
                                <a href="/help"><li>What is 24k Gold?</li></a>
                                <a href="/Login"><li>Check Gold price</li></a>
                                <a href="/help"><li>FAQ's</li></a>
                                <a href="/Blog"><li>Blogs</li></a>
                                <a href="/Buygold"><li>Instant Loan</li></a>
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
    )
}

export default Footer