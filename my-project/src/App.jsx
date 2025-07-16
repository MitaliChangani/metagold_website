import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    <header>
  <nav class="navbar">
    <ul class="nav-menu">
      <li><a href="#">MetaGold</a></li>
      <li class="dropdown">
        <a href="#">About Us</a>
        <ul class="dropdown-menu">
          <li><a href="#">What's MetaGold</a></li>
          <li><a href="#">Team</a></li>
          <li><a href="#">Careers</a></li>
          <li><a href="#">MetaGold Diaries</a></li>
        </ul>
      </li>
      <li class="dropdown">
        <a href="#">Features</a>
        <ul class="dropdown-menu">
          <li><a href="#">Buy Gold</a></li>
          <li><a href="#">Sell Gold</a></li>
        </ul>
      </li>
      <li class="dropdown">
        <a href="#">Resources</a>
        <ul class="dropdown-menu">
          <li><a href="#">Blog</a></li>
          <li><a href="#">Insights</a></li>
          <li><a href="#">Customer Stories</a></li>
          <li><a href="#">Downloadable</a></li>
        </ul>
      </li>
      <li class="dropdown">
        <a href="#">Help</a>
        <ul class="dropdown-menu">
          <li><a href="#">Contact</a></li>
          <li><a href="#">MetaGold How To's</a></li>
          <li><a href="#">FAQs</a></li>
        </ul>
      </li>
    </ul>
  </nav>
</header>
    </>
  )
}

export default App


// 111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
