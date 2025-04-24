import React, { useState, useEffect } from 'react';
import { getDatabase, ref, set, get } from 'firebase/database';
import { useNavigate } from 'react-router-dom';

function SignInOut({ onSignIn, onSignOut, user }) {
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);
    const [isLoggedIn, setIsLoggedIn] = useState(user && user !== 'undefined');

    const db = getDatabase();
    const navigate = useNavigate();

    const sanitizeEmail = (email) => email.replace(/[.#$[\]]/g, '_');
    const validateEmail = (email) =>
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.(edu|gov)$/.test(email);

    const getCurrentUserId = () => {
        return user && user !== 'undefined' ? sanitizeEmail(user) : 'undefined';
    };

    const saveUserData = async (dataType, data) => {
        const userId = getCurrentUserId();
        const dataRef = ref(db, `users/${userId}/${dataType}`);
        try {
            await set(dataRef, data);
            console.log(`Data saved for ${dataType} under userId: ${userId}`);
        } catch (error) {
            console.error(`Error saving ${dataType}:`, error);
        }
    };

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

    const migrateUndefinedData = async (newUserId) => {
        const undefinedRef = ref(db, 'users/undefined');
        const newUserRef = ref(db, `users/${newUserId}`);
        try {
            const undefinedDataSnapshot = await get(undefinedRef);
            if (undefinedDataSnapshot.exists()) {
                const undefinedData = undefinedDataSnapshot.val();
                const existingDataSnapshot = await get(newUserRef);
                const newData = existingDataSnapshot.exists()
                    ? { ...existingDataSnapshot.val(), ...undefinedData }
                    : undefinedData;

                await set(newUserRef, newData);
                await set(undefinedRef, null);
                console.log(
                    'Data migrated successfully from undefined to user ID!'
                );
            }
        } catch (error) {
            console.error('Error migrating data:', error);
        }
    };

    useEffect(() => {
        setIsLoggedIn(user && user !== 'undefined');
        setLoading(false);
    }, [onSignIn]);

    // ✅ React to changes in user prop
    useEffect(() => {
        setIsLoggedIn(user && user !== 'undefined');
    }, [user]);

    const handleSignIn = async (e) => {
        e.preventDefault();
        setError('');

        if (!email.includes('@')) {
            setError('Email must contain the "@" symbol');
        } else if (!validateEmail(email)) {
            setError(
                'Please enter a valid email address ending in .edu or .gov'
            );
        } else {
            const sanitizedEmail = sanitizeEmail(email);

            try {
                await migrateUndefinedData(sanitizedEmail);
                const userData = await fetchUserData(sanitizedEmail);
                const userRef = ref(db, `users/${sanitizedEmail}`);
                const snapshot = await get(userRef);
                if (!snapshot.exists()) {
                    await set(userRef, {
                        email,
                        bookmarks: [],
                        notes: [],
                        progress: {},
                        quizData: {},
                    });
                }

                localStorage.setItem('user', sanitizedEmail);
                onSignIn(sanitizedEmail);
                setEmail('');
                setIsLoggedIn(true);
                navigate('/Profile'); // ✅ redirect to Profile page
            } catch (error) {
                console.error('Error signing in:', error);
            }
        }
    };

    const handleSignOut = () => {
        console.log('Signing out...');
        localStorage.removeItem('user');
        onSignOut('undefined');
        setIsLoggedIn(false);
        navigate('/signin'); // Optional: stay on the same route
    };

    return (
        <div>
            {loading ? (
                <p>Loading...</p>
            ) : isLoggedIn ? (
                <div>
                    <p>Signed in as: {user}</p>
                    <button onClick={handleSignOut}>Sign Out</button>
                    <button
                        onClick={() =>
                            saveUserData('notes', {
                                text: 'Sample note after sign-in',
                            })
                        }
                    >
                        Save Note (Signed-In)
                    </button>
                </div>
            ) : (
                <div>
                    <h2 className="sign-in">Sign In / Create Account</h2>
                    <div className="sign-in-container">
                        <form onSubmit={handleSignIn}>
                            <input
                                className="sign-in"
                                placeholder="Enter your email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                            <button className="sign-in" type="submit">
                                Sign In
                            </button>
                        </form>
                        {error && <p style={{ color: 'red' }}>{error}</p>}
                    </div>
                </div>
            )}
        </div>
    );
}

export default SignInOut;
