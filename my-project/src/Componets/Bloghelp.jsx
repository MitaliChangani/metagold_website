import React from 'react'
const blogPosts = [
  {
    image: 'https://cdn.pixabay.com/photo/2017/09/04/18/02/mobile-phone-2712458_1280.jpg',
    title: 'Flipkart Franchise Cost & Profit Margin: Your Go-To...',
    author: 'Team Jar',
    date: 'July 17, 2025',
    avatar: 'https://img.icons8.com/fluency/48/000000/power-off-button.png',
  },
  {
    image: 'https://images.unsplash.com/photo-1626181132915-9fcdb0ea9ef7',
    title: 'Varalakshmi 2025: Date, Significance, Muhurat, Etc.',
    author: 'Pooja Mishra',
    date: 'July 17, 2025',
    avatar: 'https://randomuser.me/api/portraits/women/65.jpg',
  },
  {
    image: 'https://img.etimg.com/thumb/msid-99125861,width-640,height-480,imgsize-37580,resizemode-75/mother-dairy.jpg',
    title: 'How to Start a Mother Dairy Franchise in India: Cost, Profi...',
    author: 'Team Jar',
    date: 'July 16, 2025',
    avatar: 'https://img.icons8.com/fluency/48/000000/power-off-button.png',
  },
];

function Bloghelp() {
  return (
      <>
    <div>
      <section className="blog-section">
      <div className="blog-left">
        <h1>MetaGold Blog</h1>
        <div className="underline" />
        <div className="categories">
          <div className="category-group">
            <p>Festive Reads</p>
            <p>Taxes</p>
            <p>24k Gold</p>
          </div>
          <div className="category-group">
            <p>Credit Cards</p>
            <p>Tradings</p>
          </div>
          <div className="category-group">
            <p>Financial Education</p>
            {/* <p>Investment</p> */}
          </div>
        </div>
      </div>

      <div className="blog-right">
        <h3>Search for an article</h3>
        <input
          type="text"
          placeholder="Search by keyword"
          className="search-input"
        />
      </div>
    </section>
    </div>
     <section className="blog-card-section">
      {blogPosts.map((post, index) => (
        <div className="blog-card" key={index}>
          <img src={post.image} alt={post.title} className="card-image" />
          <div className="card-content">
            <h3 className="card-title">{post.title}</h3>
            <div className="card-footer">
              <img src={post.avatar} alt={post.author} className="author-img" />
              <div className="author-info">
                <span className="author-name">{post.author}</span>
                <span className="post-date">{post.date}</span>
              </div>
            </div>
          </div>
        </div>
      ))}
    </section>
    </>
  )
}

export default Bloghelp;