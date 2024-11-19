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
          <Link to="/Quiz"><img src="../img/thegiver.jpg" alt="The Giver" className="book-image" />
          </Link>
          <div className="book-title">
            The Giver
          </div>
          <div className="book-author">
            Lois Lowry
          </div>
          <div className="progress-bar">
            <div className="progress" style={{ width: '30%' }}></div>
          </div>
        </div>
        
        <div className="box">
        <img src="../img/tokillamockingbird.jpg" alt="To Kill a Mockingbird" className="book-image" />
          <div className="book-title">
            To Kill a Mockingbird
          </div>
          <div className="book-author">
            Harper Lee
          </div>
          <div className="progress-bar">
            <div className="progress" style={{ width: '1%' }}></div>
          </div>
        </div>
        <div className="box">
        <img src="../img/fahrenheit451.jpg" alt="Fahrenheit 451" className="book-image" />
          <div className="book-title">
            Fahrenheit 451
          </div>
          <div className="book-author">
            Ray Bradbury
          </div>
          <div className="progress-bar">
            <div className="progress" style={{ width: '1%' }}></div>
          </div>
        </div>
        <div className="box"></div>
        <div className="box"></div>
        <div className="box"></div>
      </div> 
    </div>
  );
};

export default Home;
