import React from 'react';
import { Link } from 'react-router-dom';

import { db } from '../index'; // You can remove this if not used elsewhere
import '../index.css';

// Import images
import theGiver from '../img/thegiver.jpg';
import toKillAMockingbird from '../img/tokillamockingbird.jpg';
import fahrenheit451 from '../img/fahrenheit451.jpg';

const Home = () => {
  return (
    <div>
      <h1 id="header">My Library</h1>

      <Link to="/Profile" aria-label="profile" className="circle"></Link>

      <div className="library-container">
        <div className="box">
          <Link to="/Quiz">
            <img src={theGiver} alt="The Giver" className="book-image" />
          </Link>
          <div className="book-title">
            The Giver
          </div>
          <div className="book-author">
            Lois Lowry
          </div>
        </div>

        <div className="box">
          <img src={toKillAMockingbird} alt="To Kill a Mockingbird" className="book-image" />
          <div className="book-title">
            To Kill a Mockingbird
          </div>
          <div className="book-author">
            Harper Lee
          </div>
        </div>

        <div className="box">
          <img src={fahrenheit451} alt="Fahrenheit 451" className="book-image" />
          <div className="book-title">
            Fahrenheit 451
          </div>
          <div className="book-author">
            Ray Bradbury
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
