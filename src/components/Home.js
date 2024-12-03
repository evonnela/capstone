import React, { useEffect, useState } from 'react';
import { ref, get } from 'firebase/database';
import { db } from '../index';
import { Link } from 'react-router-dom';
import ProgressBar from './ProgressBar';
import '../index.css';

// Import images
import theGiver from '../img/thegiver.jpg';
import toKillAMockingbird from '../img/tokillamockingbird.jpg';
import fahrenheit451 from '../img/fahrenheit451.jpg';

const Home = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const userId = "exampleUserId"; // replace with dynamic user ID when we implement it
    const progressRef = ref(db, `users/${userId}/progress`);

    get(progressRef)
      .then((snapshot) => {
        if (snapshot.exists()) {
          const progressData = snapshot.val();
          setProgress(progressData.progress);
        } else {
          console.log("No progress data found.");
        }
      })
      .catch((error) => {
        console.error("Error fetching progress:", error);
      });
  }, []);

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
          <ProgressBar progress={progress} />
        </div>
        <div className="box">
        <img src={toKillAMockingbird} alt="To Kill a Mockingbird" className="book-image" />
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
        <img src={fahrenheit451} alt="Fahrenheit 451" className="book-image" />
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
