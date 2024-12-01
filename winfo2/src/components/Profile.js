import React, { useState, useEffect } from 'react';
import { getDatabase, ref, get } from 'firebase/database';
import { db } from '../'; // Firestore configuration
import { doc, getDoc } from 'firebase/firestore';
import { BeanHead } from 'beanheads'; // Assuming BeanHead is used for rendering the avatar
import '../index.css';

const Profile = ({ userId }) => {
  const [walletPoints, setWalletPoints] = useState(null);
  const [avatarCustomization, setAvatarCustomization] = useState(null);
  const [inventory, setInventory] = useState([]);
  const [userPoints, setUserPoints] = useState(0);

  // Fetch Realtime Database data (Avatar Customization and Wallet Points)
  useEffect(() => {
    const dbRealtime = getDatabase();
    
    // Fetch avatar customization
    const avatarRef = ref(dbRealtime, `users/${userId}/avatarCustomization`);
    get(avatarRef).then((snapshot) => {
      if (snapshot.exists()) {
        setAvatarCustomization(snapshot.val());
      } else {
        console.log("No saved avatar found");
      }
    }).catch((error) => {
      console.error("Error fetching avatar customization: ", error);
    });

    // Fetch wallet points
    const pointsRef = ref(dbRealtime, `users/${userId}/walletPoints`);
    get(pointsRef).then((snapshot) => {
      if (snapshot.exists()) {
        setWalletPoints(snapshot.val());
      } else {
        console.log("No wallet points found");
      }
    }).catch((error) => {
      console.error("Error fetching wallet points: ", error);
    });
  }, [userId]);

  // Fetch Firestore data (User Points and Inventory)
  useEffect(() => {
    const fetchFirestoreData = async () => {
      const docRef = doc(db, 'users', userId); // Reference to the user document in Firestore
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        setUserPoints(data.points || 0); // Set user points
        setInventory(data.inventory || []); // Set user inventory
      } else {
        console.log("No such document!");
      }
    };

    if (userId) {
      fetchFirestoreData();
    }
  }, [userId]);

  return (
    <div className="profile-page">
      <div className="profile-container">
        {/* Profile Image */}
        {avatarCustomization ? (
          <div className="profile_IMG">
            <BeanHead {...avatarCustomization} mask={false} />
          </div>
        ) : (
          <img className="profile_IMG" src="/book/book_images/user.png" alt="Character" />
        )}

        <h1 className="username">username</h1>

        {/* Points: Firestore and Realtime Database data */}
        <p className="points">Points: {userPoints !== null ? userPoints : walletPoints !== null ? walletPoints * 100 : 'Loading...'}</p>

        {/* Main Content: Student Info, Completed Books, Inventory */}
        <div className="main-content">
          {/* Student Info */}
          <div className="student-info">
            <p>Grade Level: 10</p>
            <p>School: Springfield High</p>
            <p>Teacher: Mr. Smith</p>
            <p>StudentID: 123456</p>
          </div>

          {/* Completed Books */}
          <div className="completed-books">
            <h2>Completed Books</h2>
            <ul className="books-list">
              <li>
                <img className="book-cover" src="/img/alexander.png" alt="The Crossover by Kwame Alexander" />
                <span className="book-title">The Crossover</span>
                <span className="book-author">Kwame Alexander</span>
                <span className="stars">⭐️⭐️⭐️⭐️⭐️</span>
              </li>
              <li>
                <img className="book-cover" src="/img/jackson.png" alt="The Lightning Thief by Percy Jackson" />
                <span className="book-title">The Lightning Thief</span>
                <span className="book-author">Percy Jackson</span>
                <span className="stars">⭐️⭐️⭐️⭐️</span>
              </li>
            </ul>
          </div>

          {/* Inventory */}
          <div className="inventory">
            <h2>Inventory</h2>
            <ul className="inventory-items">
              {inventory.length > 0 ? (
                inventory.map((item, index) => (
                  <li key={index}>
                    <img className="item-photo" src={item.image || "/img/default-item.png"} alt={item.name} />
                    <span className="item-name">{item.name}</span>
                  </li>
                ))
              ) : (
                <li>Your inventory is empty.</li>
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
