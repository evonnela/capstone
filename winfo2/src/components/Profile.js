import React, { useState } from 'react';
import SignInOut from './SignInOut';

function Profile() {
  const [user, setUser] = useState(null);

  const handleSignIn = (email) => {
    setUser(email);  // Set the user to the signed-in email
  };

  const handleSignOut = () => {
    setUser(null);  // Clear the user when signed out
  };

  return (
    <div>
      <h1>Profile Page</h1>
      <SignInOut user={user} onSignIn={handleSignIn} onSignOut={handleSignOut} />
    </div>
  );
}

export default Profile;