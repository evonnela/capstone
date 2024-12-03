import React, { useState, useEffect } from 'react';
import { getDatabase, ref, get } from 'firebase/database';
import { db } from '../'; // Firestore configuration
import { doc, getDoc } from 'firebase/firestore';
import { BeanHead } from 'beanheads';
import '../index.css';
import SignInOut from './SignInOut';

const Profile = () => {
  const [avatarCustomization, setAvatarCustomization] = useState(null);
  const [walletPoints, setWalletPoints] = useState(null);
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

  // If user is signed in, display profile information
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
      <div className="student-info">
        <p>Grade Level: 10</p>
        <p>School: Springfield High</p>
        <p>Teacher: Mr. Smith</p>
        <p>Student ID: 123456</p>
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
