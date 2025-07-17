import React from 'react'
import upi from './assets/upi.png';

const About1 = ({amount ,goldInGrams, goldPrice, formattedTime}) => {
    return (
        <>

            <main className="hero">
                <section className="left">
                    <h1>
                        Save Money in <span className="highlight">digital gold</span> from ₹ 10.
                    </h1>
                    <p>It’s automatic. Like magic.</p>
                    <button className="start-saving">Start Saving</button>

                    <div className="powered-rating">
                        <p className="powered">
                            Powered by <img src={upi} alt="upi" />
                        </p>
                        <div className="rating">
                            <p>Rated <strong>4.7</strong></p>
                            <span>⭐️⭐️⭐️⭐️⭐️½</span>
                            <span>by <strong>3.5 Crore</strong> users</span>
                        </div>
                    </div>
                </section>

                <section className="right">
                    <div className="card">
                        <div className="tabs">
                            <button className="active">Buy</button>
                            <button>Sell</button>
                        </div>

                        <label className="label">Enter gold amount</label>
                        <div className="input-toggle">
                            <button className="active">In Rupees</button>
                            <button>In Grams</button>
                        </div>

                        <div className="amount">
                            ₹ {amount}
                            <span>{goldInGrams} g</span>
                        </div>

                        <div className="price-box">
                            <span className="live">🔴 LIVE</span>
                            <span className="price">Price: ₹{goldPrice.toFixed(2)}/g</span>
                            <span className="validity">Valid for: {formattedTime}</span>
                        </div>

                        <button className="buy-now">Buy Now</button>
                    </div>
                </section>
            </main>
            </>
    )
}

export default About1
