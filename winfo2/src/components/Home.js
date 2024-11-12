import React from 'react';
import { Link } from 'react-router-dom';
import '../index.css';

const Home = () => {
  return (
    <div>
      {/* <div className="navbar">
        <div className="navbar-content">
          <h1 id="nav-title">Level Up Learning</h1>
          <a href="#" className="nav-link">Log Out</a>
        </div>
      </div> */}
      
      <h1 id="header">My Library</h1>  

      <Link to="/Profile" aria-label="profile" className="circle"></Link>

      <div className="library-container">
        <div className="box">
          <Link to="/Book"><img src="../img/thegiver.jpg" alt="The Giver" className="book-image" />
          </Link>
          <div className="progress-bar">
            <div className="progress" style={{ width: '30%' }}></div>
          </div>
        </div>
        
        <div className="box"></div>
        <div className="box"></div>
        <div className="box"></div>
        <div className="box"></div>
        <div className="box"></div>
      </div> 
    </div>
  );
};

export default Home;
