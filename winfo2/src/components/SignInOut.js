import React, { useState, useEffect } from 'react';
import { getDatabase, ref, set, get, push } from 'firebase/database';

function SignInOut({ onSignIn, onSignOut, user }) {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const db = getDatabase();

  // Helper function to sanitize email for use as Firebase key
  const sanitizeEmail = (email) => email.replace(/[.#$[\]]/g, '_');

  // Helper function to validate email format
  const validateEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.(edu|gov)$/;
    return emailRegex.test(email);
  };

  // Determine current user ID (either email or "undefined")
  const getCurrentUserId = () => {
    return user && user !== 'undefined' ? sanitizeEmail(user) : 'undefined';
  };

  // Save data dynamically for the current user
  const saveUserData = async (dataType, data) => {
    const userId = getCurrentUserId();
    const dataRef = ref(db, `users/${userId}/${dataType}`);
    try {
      await push(dataRef, data); // Push new data
      console.log(`Data saved for ${dataType} under userId: ${userId}`);
    } catch (error) {
      console.error(`Error saving ${dataType}:`, error);
    }
  };

  // Retrieve user data on sign-in to ensure continuity
  const fetchUserData = async (userId) => {
    const userRef = ref(db, `users/${userId}`);
    try {
      const snapshot = await get(userRef);
      if (snapshot.exists()) {
        const data = snapshot.val();
        console.log(`User data fetched for ${userId}:`, data);
        return data;
      }
    } catch (error) {
      console.error(`Error fetching data for ${userId}:`, error);
    }
    return null;
  };

  // Migrate data from "undefined" to the user's email when signing in
  const migrateUndefinedData = async (newUserId) => {
    const undefinedRef = ref(db, 'users/undefined');
    const newUserRef = ref(db, `users/${newUserId}`);
    try {
      const undefinedDataSnapshot = await get(undefinedRef);
      if (undefinedDataSnapshot.exists()) {
        const undefinedData = undefinedDataSnapshot.val();
        const existingDataSnapshot = await get(newUserRef);

        // Merge undefined data with existing user data
        const newData = existingDataSnapshot.exists()
          ? { ...existingDataSnapshot.val(), ...undefinedData }
          : undefinedData;

        await set(newUserRef, newData); // Save merged data to user ID
        await set(undefinedRef, null); // Clear data from "undefined"
        console.log('Data migrated successfully from undefined to user ID!');
      }
    } catch (error) {
      console.error('Error migrating data:', error);
    }
  };

  // On component mount, check for saved user
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      onSignIn(savedUser);
    } else {
      onSignIn('undefined'); // Default to "undefined" if no user is signed in
    }
    setLoading(false);
  }, [onSignIn]);

  // Handle user sign-in
  const handleSignIn = async (e) => {
    e.preventDefault();
    setError('');

    if (!email.includes('@')) {
      setError('Email must contain the "@" symbol');
    } else if (!validateEmail(email)) {
      setError('Please enter a valid email address ending in .edu or .gov');
    } else {
      const sanitizedEmail = sanitizeEmail(email);

      try {
        // Migrate data from "undefined" to the new user ID
        await migrateUndefinedData(sanitizedEmail);

        // Fetch and log existing user data
        const userData = await fetchUserData(sanitizedEmail);
        console.log('Fetched user data on sign-in:', userData);

        // Save user email in Firebase if it doesn't exist
        const userRef = ref(db, `users/${sanitizedEmail}`);
        const snapshot = await get(userRef);
        if (!snapshot.exists()) {
          await set(userRef, { email, bookmarks: [], notes: [], progress: {}, quizData: {} });
        }

        // Update localStorage and app state
        localStorage.setItem('user', email);
        onSignIn(email);

        setEmail('');
        console.log(`Signed in as ${email}`);
      } catch (error) {
        console.error('Error signing in:', error);
      }
    }
  };

  // Handle user sign-out
  const handleSignOut = () => {
    console.log('Saving signed-in user data...');
    // Clear user data in localStorage and app state
    localStorage.removeItem('user');
    onSignOut('undefined');
    console.log('Signed out successfully.');
  };

  return (
    <div>
      {loading ? (
        <p>Loading...</p>
      ) : user && user !== 'undefined' ? (
        <div>
          <p>Signed in as: {user}</p>
          <button onClick={handleSignOut}>Sign Out</button>
          <button onClick={() => saveUserData('notes', { text: 'Sample note after sign-in' })}>
            Save Note (Signed-In)
          </button>
        </div>
      ) : (
        <div>
          <h2>Sign In / Create Account</h2>
          <form onSubmit={handleSignIn}>
            <input
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button type="submit">Sign In</button>
          </form>
          {error && <p style={{ color: 'red' }}>{error}</p>}
          <button onClick={() => saveUserData('notes', { text: 'Sample note unsigned' })}>
            Save Note (Unsigned)
          </button>
        </div>
      )}
    </div>
  );
}

export default SignInOut;