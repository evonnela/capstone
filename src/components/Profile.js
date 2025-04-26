import React, { useState, useEffect } from 'react';
import { getDatabase, ref, get, set } from 'firebase/database';
import { BeanHead } from 'beanheads';
import '../index.css';
import SignInOut from './SignInOut';

// ✅ Safely encode Firebase key while keeping @
const encodeEmail = (email) => email.replace(/[.#$[\]]/g, '_');

const Profile = ({ user, onSignOut }) => {
    const [avatarCustomization, setAvatarCustomization] = useState(null);
    const [walletPoints, setWalletPoints] = useState(null);
    const [profileInfo, setProfileInfo] = useState({
        grade: '',
        school: '',
        teacher: '',
        studentId: '',
    });

    useEffect(() => {
        if (!user || user === 'undefined') return;

        const db = getDatabase();
        const userKey = encodeEmail(user);

        // Fetch avatar
        get(ref(db, `users/${userKey}/avatarCustomization`))
            .then(
                (snapshot) =>
                    snapshot.exists() && setAvatarCustomization(snapshot.val())
            )
            .catch((error) =>
                console.error('Error fetching avatar customization:', error)
            );

        // Fetch wallet points
        get(ref(db, `users/${userKey}/walletPoints`))
            .then(
                (snapshot) =>
                    snapshot.exists() && setWalletPoints(snapshot.val())
            )
            .catch((error) =>
                console.error('Error fetching wallet points:', error)
            );

        // Fetch profile info
        get(ref(db, `users/${userKey}/profileInfo`))
            .then((snapshot) => {
                if (snapshot.exists()) {
                    setProfileInfo(snapshot.val());
                }
            })
            .catch((error) =>
                console.error('Error fetching profile info:', error)
            );
    }, [user]);

    const handleSaveProfile = async () => {
        if (!user || user === 'undefined') return;

        const db = getDatabase();
        const userKey = encodeEmail(user);
        const infoRef = ref(db, `users/${userKey}/profileInfo`);

        try {
            await set(infoRef, profileInfo);
            alert('Profile info saved!');
        } catch (err) {
            console.error('Error saving profile info:', err);
        }
    };

    if (!user || user === 'undefined') {
        return (
            <SignInOut
                user={user}
                onSignIn={(email) => {
                    localStorage.setItem('user', email);
                    window.location.reload();
                }}
                onSignOut={onSignOut}
            />
        );
    }

    return (
        <div className="profile-container">
            {avatarCustomization ? (
                <div className="profile_IMG">
                    <BeanHead {...avatarCustomization} mask={false} />
                </div>
            ) : (
                <img
                    className="profile_IMG"
                    src="/book/book_images/user.png"
                    alt="Character"
                />
            )}

            <h1 className="username">{user}</h1>
            <p className="points">
                Points:{' '}
                {walletPoints !== null ? walletPoints * 100 : 'Loading...'}
            </p>

            <div className="student-info">
                <label>
                    Grade Level:
                    <input
                        value={profileInfo.grade}
                        onChange={(e) =>
                            setProfileInfo({
                                ...profileInfo,
                                grade: e.target.value,
                            })
                        }
                    />
                </label>
                <label>
                    School:
                    <input
                        value={profileInfo.school}
                        onChange={(e) =>
                            setProfileInfo({
                                ...profileInfo,
                                school: e.target.value,
                            })
                        }
                    />
                </label>
                <label>
                    Teacher:
                    <input
                        value={profileInfo.teacher}
                        onChange={(e) =>
                            setProfileInfo({
                                ...profileInfo,
                                teacher: e.target.value,
                            })
                        }
                    />
                </label>
                <label>
                    Student ID:
                    <input
                        value={profileInfo.studentId}
                        onChange={(e) =>
                            setProfileInfo({
                                ...profileInfo,
                                studentId: e.target.value,
                            })
                        }
                    />
                </label>

                <button onClick={handleSaveProfile}>Save Info</button>
            </div>

            <div className="sign-out-button-container">
                <button onClick={onSignOut} className="sign-out-button">
                    Sign Out
                </button>
            </div>
        </div>
    );
};

export default Profile;
