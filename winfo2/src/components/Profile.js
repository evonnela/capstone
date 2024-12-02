import React, { useState, useEffect } from 'react';
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
  const [completedBooks, setCompletedBooks] = useState([]);
  const [user, setUser] = useState(null);

  const sanitizeUsername = (username) => {
    return username.replace(/\./g, ',').replace(/@/g, '_at_');
  };

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser && storedUser !== 'undefined') {
      setUser(storedUser);
    } else {
      setUser(null);
    }
  }, []);

  useEffect(() => {
    if (!user) return;
    const sanitizedUser = sanitizeUsername(user);
    const database = getDatabase();

    // Fetch avatar customization data
    const avatarRef = ref(database, `users/${sanitizedUser}/avatarCustomization`);
    get(avatarRef)
      .then((snapshot) => snapshot.exists() && setAvatarCustomization(snapshot.val()))
      .catch((error) => console.error("Error fetching avatar customization: ", error));

    // Fetch wallet points
    const pointsRef = ref(database, `users/${sanitizedUser}/walletPoints`);
    get(pointsRef)
      .then((snapshot) => snapshot.exists() && setWalletPoints(snapshot.val()))
      .catch((error) => console.error("Error fetching wallet points: ", error));

    // Fetch user data from Firestore
    const fetchFirestoreData = async () => {
      try {
        const userRef = doc(db, 'users', sanitizedUser);
        const userDoc = await getDoc(userRef);
        if (userDoc.exists()) {
          const data = userDoc.data();
          setInventory(data.inventory || []);
          setCompletedBooks(data.completedBooks || []);
          setWalletPoints(data.walletPoints || 0);
          setAvatarCustomization(data.avatarCustomization || null);
        }
      } catch (error) {
        console.error("Error fetching user data: ", error);
      }
    };

    fetchFirestoreData();
  }, [user]);

  const handleSignOut = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  if (!user) {
    return (
      <div>
        <SignInOut
          onSignIn={(email) => {
            setUser(email);
            localStorage.setItem('user', email);
          }}
          onSignOut={handleSignOut}
        />
      </div>
    );
  }

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
      <p className="points">
        Points: {walletPoints !== null ? walletPoints * 100 : 'Loading...'}
      </p>
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
            {completedBooks.length > 0 ? (
              completedBooks.map((book, index) => (
                <li key={index}>
                  <img
                    className="book-cover"
                    src={book.image || '/img/default-book.png'}
                    alt={book.title}
                  />
                  <span className="book-title-profile">{book.title}</span>
                  <span className="book-author-profile">{book.author}</span>
                  <span className="stars">⭐️⭐️⭐️⭐️⭐️</span>
                </li>
              ))
            ) : (
              <li>No completed books yet.</li>
            )}
          </ul>
        </div>
        <div className="inventory">
          <h2 className="profile">Inventory</h2>
          <ul className="inventory-items">
            {inventory.length > 0 ? (
              inventory.map((item, index) => (
                <li key={index} className="inventory-item">
                  <img
                    className="item-photo"
                    src={item.image || '/img/default-item.png'}
                    alt={item.name}
                  />
                  <span className="item-name">{item.name}</span>
                </li>
              ))
            ) : (
              <li>Your inventory is empty.</li>
            )}
          </ul>
        </div>
      </div>
      <div className="sign-out-button-container">
        <button onClick={handleSignOut} className="sign-out-button">
          Sign Out
        </button>
      </div>
    </div>
  );
};

export default Profile;
