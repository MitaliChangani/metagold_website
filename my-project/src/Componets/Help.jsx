import React from 'react'
import './Help.css'
const faqData = [
    {
        question: "What is MetaGold?",
        answer:
            "MetaGold is a digital platform that allows users to buy, sell, and store gold online securely. We offer real-time gold prices, investment tools, and instant transactions.",
    },
    {
        question: "Is my gold physically stored?",
        answer:
            "Yes. Every gram of gold you purchase is backed by physical gold stored in secure, insured vaults with our trusted storage partners.",
    },
    {
        question: "Can I sell my gold anytime?",
        answer:
            "Absolutely! You can sell your gold instantly on our platform 24/7 at live market prices.",
    },
    {
        question: "What is the minimum amount to start investing?",
        answer:
            "You can start investing in gold with as little as ₹500 on MetaGold. We support micro-investing to make gold accessible to everyone.",
    },
    {
        question: "How do I track my gold holdings?",
        answer:
            "Your dashboard shows your live gold balance, its current value, and all transaction history. We also send price alerts and portfolio updates.",
    },
    {
        question: "Is MetaGold regulated and safe?",
        answer:
            "Yes. We partner with SEBI-registered custodians and gold refineries. Your funds and gold are held in trust and fully insured.",
    },
    {
        question: "Can I take physical delivery of gold?",
        answer:
            "Yes. You can request delivery of your gold anytime, in the form of certified coins or bars, directly to your doorstep.",
    },
    {
        question: "What is the current gold price on MetaGold?",
        answer:
            "The gold price is updated in real-time and reflects global market trends with a small platform fee for transactions.",
    },
    {
        question: "Are there any hidden charges?",
        answer:
            "No hidden charges. We clearly mention all applicable fees during transactions. Buying/selling includes a nominal margin or convenience fee.",
    },
    {
        question: "What if I forget my password?",
        answer:
            "Click on Forgot Password on the login screen and follow the steps to reset securely via email or OTP.",
    },
    {
        question: "Is there a mobile app available?",
        answer:
            "Yes. MetaGold is available on both Android and iOS for seamless mobile access to your investments.",
    },
    {
        question: "How do I contact customer support?",
        answer: (
            <>
                You can reach us through:
                <br />
                
                <strong>Email:</strong> info@BusinessBuddyIndia.com
                <br />
                <strong>Helpline:</strong> +91 73593 82025 (Mon–Sat, 9 AM to 7 PM)
            </>
        ),
    },
];
function Help() {
    return (
        <>
            <div className='help'>
                <h1>How it Works?</h1>
                <div className="faq-container">
                    <h2 className="faq-title">Frequently Asked Questions</h2>
                    {faqData.map((faq, index) => (
                        <div className="faq-box" key={index}>
                            <h3 className="faq-question">🟡 {index + 1}. {faq.question}</h3>
                            <p className="faq-answer">{faq.answer}</p>
                        </div>
                    ))}
                </div>
            </div>
        </>
    )
}

export default Help