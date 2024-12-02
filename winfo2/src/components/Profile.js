import React, { useState, useEffect } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getDatabase, ref, get } from 'firebase/database';
import { db } from '../'; // Firestore configuration
import { doc, getDoc } from 'firebase/firestore';
import { BeanHead } from 'beanheads';
import '../index.css';
import SignInOut from './SignInOut';

const Profile = () => {
  const [walletPoints, setWalletPoints] = useState(null);
  const [avatarCustomization, setAvatarCustomization] = useState(null);
  const [inventory, setInventory] = useState([]);
  const [user, setUser] = useState(null);

  const sanitizeUsername = (username) => {
    return username.replace(/\./g, ',').replace(/@/g, '_at_');
  };

  // Monitor authentication state
  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser.email);
      } else {
        setUser(null);
      }
    });

    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(storedUser);
    }

    return unsubscribe;
  }, []);

  useEffect(() => {
    if (!user) return; 

    const sanitizedUser = sanitizeUsername(user);

    const database = getDatabase();

    // Fetch avatar customization data from Realtime Database
    const avatarRef = ref(database, `users/${sanitizedUser}/avatarCustomization`);
    get(avatarRef)
      .then((snapshot) => {
        if (snapshot.exists()) {
          setAvatarCustomization(snapshot.val());
        } else {
          console.log("No saved avatar found");
        }
      })
      .catch((error) => {
        console.error("Error fetching avatar customization: ", error);
      });

    // Fetch wallet points from Realtime Database
    const pointsRef = ref(database, `users/${sanitizedUser}/walletPoints`);
    get(pointsRef)
      .then((snapshot) => {
        if (snapshot.exists()) {
          setWalletPoints(snapshot.val());
        } else {
          console.log("No wallet points found");
        }
      })
      .catch((error) => {
        console.error("Error fetching wallet points: ", error);
      });

    // Fetch data from Firestore
    const fetchFirestoreData = async () => {
      try {
        const userRef = doc(db, 'users', sanitizedUser);
        const userDoc = await getDoc(userRef);

        if (userDoc.exists()) {
          const data = userDoc.data();
          setWalletPoints(data.walletPoints || 0);
          setInventory(data.inventory || []);
          setAvatarCustomization(data.avatarCustomization || null);
        } else {
          console.log("No such document!");
        }
      } catch (error) {
        console.error("Error fetching user data: ", error);
      }
    };

    fetchFirestoreData();
  }, [user]); // Re-run when the user changes

  // Show the SignInOut component if the user is not logged in
  if (!user) {
    return <SignInOut onSignIn={(email) => {
        setUser(email);
        localStorage.setItem('user', email);
      }} onSignOut={() => {
        setUser(null);
        localStorage.removeItem('user'); 
      }} user={user} />;
  }

  // Render profile information if the user is logged in
  return (
    <div className="profile-container">
      {avatarCustomization ? (
        <div className="profile_IMG">
          <BeanHead {...avatarCustomization} mask={false} />
        </div>
      ) : (
        <img className="profile_IMG" src="/book/book_images/user.png" alt="Character" />
      )}
      <h1 className="username">{user}</h1>
      <p className="points">Points: {walletPoints !== null ? walletPoints * 100 : 'Loading...'}</p>
      <div className="main-content">
        <div className="student-info">
          <p>Grade Level: 10</p>
          <p>School: Springfield High</p>
          <p>Teacher: Mr. Smith</p>
          <p>StudentID: 123456</p>
        </div>
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
