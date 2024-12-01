import React, { useState, useEffect } from 'react';
import { getDatabase, ref, get } from 'firebase/database';
import { db } from '../'; // Firestore configuration
import { doc, getDoc } from 'firebase/firestore';
import { BeanHead } from 'beanheads';
import '../index.css';

const Profile = () => {
  const [walletPoints, setWalletPoints] = useState(null);
  const [avatarCustomization, setAvatarCustomization] = useState(null);  // State to hold the avatar customization
  const [inventory, setInventory] = useState([]);
  const userId = "exampleUserId";  // Replace with the actual user ID

  useEffect(() => {
    const db = getDatabase();

    // Fetch the saved avatar customization from Firebase
    const avatarRef = ref(db, `users/${userId}/avatarCustomization`);

    get(avatarRef).then((snapshot) => {
      if (snapshot.exists()) {
        setAvatarCustomization(snapshot.val());  // Update the state with the saved avatar customization
      } else {
        console.log("No saved avatar found");
      }
    }).catch((error) => {
      console.error("Error fetching avatar customization: ", error);
    });

    const pointsRef = ref(db, `users/${userId}/walletPoints`);
    get(pointsRef).then((snapshot) => {
      if (snapshot.exists()) {
        setWalletPoints(snapshot.val());
      } else {
        console.log("No wallet points found");
      }
    }).catch((error) => {
      console.error("Error fetching wallet points: ", error);
    });
  }, []);

  useEffect(() => {
    // Fetch data from Firestore
    const fetchFirestoreData = async () => {
      try {
        const userRef = doc(db, 'users', userId);
        const userDoc = await getDoc(userRef);

        if (userDoc.exists()) {
          const data = userDoc.data();
          setWalletPoints(data.walletPoints || 0);  // Wallet points fetched from Firestore
          setInventory(data.inventory || []);  // Inventory fetched from Firestore
          setAvatarCustomization(data.avatarCustomization || null);  // Avatar customization data
        } else {
          console.log("No such document!");
        }
      } catch (error) {
        console.error("Error fetching user data: ", error);
      }
    };

    fetchFirestoreData();
  }, [userId]);

  return (
    <div className="profile-container">
      {/* Profile Image */}
      {avatarCustomization ? (
        <div className="profile_IMG">
          <BeanHead {...avatarCustomization} mask={false} />
        </div>
      ) : (
        <img className="profile_IMG" src="/book/book_images/user.png" alt="Character" />
      )}

      <h1 className="username">{userId}</h1>

      {/* Display wallet points, if available, multiplied by 100 */}
      <p className="points">Points: {walletPoints !== null ? walletPoints * 100 : 'Loading...'}</p>

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
          <h2 className="profile">Completed Books</h2>
          <ul className="books-list">
            <li>
              <img className="book-cover" src="/img/alexander.png" alt="The Crossover by Kwame Alexander" />
              <span className="book-title-profile">The Crossover</span>
              <span className="book-author-profile">Kwame Alexander</span>
              <span className="stars">⭐️⭐️⭐️⭐️⭐️</span>
            </li>
            <li>
              <img className="book-cover" src="/img/jackson.png" alt="The Lightning Thief by Percy Jackson" />
              <span className="book-title-profile">The Lightning Thief</span>
              <span className="book-author-profile">Percy Jackson</span>
              <span className="stars">⭐️⭐️⭐️⭐️</span>
            </li>
          </ul>
        </div>

        {/* Inventory */}
        <div className="inventory">
            <h2 className="profile">Inventory</h2>
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
  );
};

export default Profile;