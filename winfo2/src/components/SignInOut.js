import React, { useState } from 'react';

function SignInOut({ onSignIn, onSignOut, user }) {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  // Validate if email contains @ symbol and ends with .edu or .gov
  const validateEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.(edu|gov)$/;
    return emailRegex.test(email);
  };

  // Check if email contains '@' symbol
  const containsAtSymbol = (email) => {
    return email.includes('@');
  };

  const handleSignIn = (e) => {
    e.preventDefault();

    // Clear previous error message before starting validation
    setError('');

    // Check for @ symbol first
    if (!containsAtSymbol(email)) {
      setError('Email must contain the "@" symbol');
    }
    // Then validate full email format if @ symbol exists
    else if (!validateEmail(email)) {
      setError('Please enter a valid email address ending in .edu or .gov');
    }
    // If all validation passes, proceed with sign-in
    else {
      onSignIn(email);   // Set the user email in the parent component (Profile)
      setEmail('');       // Clear the input box after sign-in
    }
  };

  const handleSignOut = () => {
    onSignOut();         // Clear the user state in the parent component (Profile)
    setEmail('');        // Clear the email input box
  };

  return (
    <div>
      {user ? (
        <div>
          <p>Signed in as: {user}</p>
          <button onClick={handleSignOut}>Sign Out</button>
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
        </div>
      )}
    </div>
  );
}

export default SignInOut;