import React from 'react'
import './Blog.css'
import Blog11 from '../assets/Blog11.png'
import Blog2 from '../assets/Blog2.jpg'
import Blog3 from '../assets/Blog3.png'
const blogPosts = [
  {
    title: "5 Reasons to Trading in Digital Gold Today",
    date: "July 10, 2025",
    description:
      "Digital gold is becoming one of the safest and most convenient ways to invest. Here's why it's time to consider it for your portfolio.",
    image: Blog11,
  },
  {
    title: "How to Use MetaGold's Income Tax Calculator",
    date: "July 5, 2025",
    description:
      "Filing taxes can be confusing. Learn how MetaGold's free tool helps you calculate your FY 2025–26 taxes with ease.",
    image: Blog2,
  },
  {
    title: "Instant Loans vs Traditional Loans - What's Better?",
    date: "June 25, 2025",
    description:
      "Instant digital loans are transforming how we borrow. But are they better than traditional loans? Let's explore.",
    image: Blog3,
  },
];
function Blog() {
  return (
    <>
    <div>
       <div className="blog-container">
      <h2 className="blog-title">MetaGold Blog</h2>
      <div className="blog-grid">
        {blogPosts.map((post, index) => (
          <div className="blog-card" key={index}>
            <img src={post.image} alt={post.title} className="blog-img" />
            <div className="blog-content">
              <h3 className="blog-post-title">{post.title}</h3>
              <p className="blog-date">{post.date}</p>
              <p className="blog-description">{post.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
    </div>
    </>
  )
}

export default Blog