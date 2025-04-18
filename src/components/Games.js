import React, { useState, useEffect } from 'react';
import { db } from '../index';
import { doc, getDoc } from 'firebase/firestore';
import angryfaceIcon from '../img/angryface.png'; // placeholder icon
import theGiverCover from '../img/memoryMatchImg/cardBack.png';
import { Link } from 'react-router-dom';

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
    // Add more games here later
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

  // Optional purchase logic (you can re-enable later)
  /*
  const updateUserData = async (newInventory, newPoints) => {
    const docRef = doc(db, 'users', userId);
    await updateDoc(docRef, {
      inventory: newInventory,
      points: newPoints
    });
  };

  const handlePurchase = async (game) => {
    if (pointsRemaining < game.points) {
      alert("Not enough points to purchase this game.");
      return;
    }

    const newInventory = [...inventory, game];
    const newPoints = pointsRemaining - game.points;

    setInventory(newInventory);
    setPointsRemaining(newPoints);
    setUserPoints(newPoints);

    await updateUserData(newInventory, newPoints);
  };

  const hasGame = (name) => inventory.some((item) => item.name === name);
  */

  return (
    <div style={{ padding: '20px' }}>
      <h1 style={{ fontSize: '28px' }}>🎮 Game Store</h1>
      <p>You have <strong>{pointsRemaining}</strong> points.</p>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', marginTop: '30px' }}>
        {games.map((game) => (
          <div key={game.id} style={{ border: '1px solid #ccc', borderRadius: '8px', padding: '16px', width: '250px' }}>
            <img src={game.image} alt={game.name} style={{ width: '250px', height: '250px', objectFit: 'cover' }} />
            <h3>{game.name}</h3>
            <p>{game.description}</p>
            <p><strong>{game.points}</strong> points</p>
            {/* Uncomment when enabling purchase */}
            {/* {hasGame(game.name) ? (
              <button disabled>✅ Purchased</button>
            ) : (
              <button onClick={() => handlePurchase(game)}>Purchase</button>
            )} */}
            <Link to={game.route}>
            <button style={{ backgroundColor: '#4caf50', color: 'white', padding: '8px 12px', borderRadius: '6px' }}>
              Play Now
            </button>
          </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Games;

