import React, { useState, useEffect } from 'react';
import { db } from '../index';
import { doc, getDoc } from 'firebase/firestore';
import angryfaceIcon from '../img/angryface.png'; 
import theGiverCover from '../img/memoryMatchImg/cardBack.png';
import { Link } from 'react-router-dom';
import '../index.css';

const Games = ({ userId, userPoints, setUserPoints }) => {
  const [inventory, setInventory] = useState([]);
  const [pointsRemaining, setPointsRemaining] = useState(userPoints);

  const games = [
    {
      id: 1,
      name: 'Angryman Game',
      description: 'Play the classic word-guessing game themed around *The Giver*!',
      image: angryfaceIcon,
      points: 500,
      route: '/angryman'
    },
    {
      id: 2,
      name: 'Memory Match Game',
      description: 'Play a memory matching game with *The Giver* characters!',
      image: theGiverCover,
      points: 500,
      route: '/memorymatch'
    }
  ];

  useEffect(() => {
    const fetchUserData = async () => {
      if (!userId) return;
      const docRef = doc(db, 'users', userId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        setInventory(data.inventory || []);
        setPointsRemaining(data.points || 50);
      }
    };

    fetchUserData();
  }, [userId]);

  return (
    <div className="games-container">
      <h1 className="avatar-header">🎮 Game Store</h1>
      <h2 className="points-text">You have <strong>{pointsRemaining}</strong> points.</h2>

      <div className="games-grid">
        {games.map((game) => (
          <div key={game.id} className="game-card">
            <img src={game.image} alt={game.name} className="game-image" />
            <h2 className="game-title">{game.name}</h2>
            <p className="game-description">{game.description}</p>
            <p className="game-points"><strong>{game.points}</strong> points</p>
            <Link to={game.route}>
              <button className="play-button">Play Now</button>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Games;
