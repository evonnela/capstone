import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { signOut, getAuth } from 'firebase/auth';
import { getDatabase, ref, get } from 'firebase/database';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import { BeanHead } from 'beanheads'; // Used for rendering the avatar

const NavBar = ({ userId, tempAvatar, refreshKey }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    // We'll keep the firebase avatar customization for logged in users
    const [avatarCustomization, setAvatarCustomization] = useState(null);
    const navigate = useNavigate();
    const location = useLocation();

    // Fetch saved avatar customization from Firebase
    useEffect(() => {
        if (!userId || userId === 'undefined') return;

        const db = getDatabase();
        const safeUserId = userId.replace(/[.#$[\]]/g, '_');
        const avatarRef = ref(db, `users/${safeUserId}/avatarCustomization`);

        get(avatarRef)
            .then((snapshot) => {
                if (snapshot.exists()) {
                    setAvatarCustomization(snapshot.val());
                }
            })
            .catch((error) => {
                console.error('Error fetching avatar customization:', error);
            });
    }, [userId, refreshKey]); // ✅ include refreshKey

    // Handle sign out
    const handleSignOut = () => {
        signOut(getAuth())
            .then(() => {
                setIsMenuOpen(false);
                alert('Signed Out');
                navigate('/');
            })
            .catch((error) => {
                console.error('Error signing out:', error);
            });
    };

    // Toggle menu visibility
    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

    // Close menu on resize or route change
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth > 768) {
                setIsMenuOpen(false);
            }
        };

        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    useEffect(() => {
        setIsMenuOpen(false); // Close menu on route change
    }, [location]);

    const navbarClassName = isMenuOpen ? 'navbar-nav show' : 'navbar-nav';

    return (
        <header className="container-fluid">
            <nav className="navbar navbar-expand-lg">
                <div className="container-fluid">
                    <a
                        className="navbar-brand"
                        href="/"
                        aria-label="Website logo"
                    >
                        <img
                            src={`${process.env.PUBLIC_URL}/book/book_images/logo.png`}
                            alt="logo"
                        />
                    </a>

                    {/* Website Title */}
                    <span className="navbar-title">Level Up Learning</span>

                    {/* Hamburger Menu Toggle */}
                    <button
                        className="navbar-toggler"
                        type="button"
                        aria-expanded={isMenuOpen}
                        aria-label="Toggle navigation"
                        onClick={toggleMenu}
                    >
                        <FontAwesomeIcon icon={faBars} />
                    </button>

                    {/* Navigation Links */}
                    <div
                        className={navbarClassName}
                        id="navbarSupportedContent"
                    >
                        <ul className="navbar-nav">
                            <li className="nav-item">
                                <NavLink
                                    to="/"
                                    className="nav-link"
                                    onClick={toggleMenu}
                                >
                                    Library
                                </NavLink>
                            </li>
                            <li className="nav-item">
                                <NavLink
                                    to="/CharacterBuilding"
                                    className="nav-link"
                                    onClick={toggleMenu}
                                >
                                    Build Character
                                </NavLink>
                            </li>
                            <li className="nav-item">
                                <NavLink
                                    to="/Games"
                                    className="nav-link"
                                    onClick={toggleMenu}
                                >
                                    Games
                                </NavLink>
                            </li>
                        </ul>

                        {/* Vertically aligned NavLinks when the menu is open */}
                        {isMenuOpen && (
                            <ul className="navbar-nav vertical-nav">
                                <li className="nav-item">
                                    <NavLink
                                        to="/"
                                        className="nav-link"
                                        onClick={toggleMenu}
                                    >
                                        Library
                                    </NavLink>
                                </li>
                                <li className="nav-item">
                                    <NavLink
                                        to="/CharacterBuilding"
                                        className="nav-link"
                                        onClick={toggleMenu}
                                    >
                                        Build Character
                                    </NavLink>
                                </li>
                                <li className="nav-item">
                                    <NavLink
                                        to="/Games"
                                        className="nav-link"
                                        onClick={toggleMenu}
                                    >
                                        Games
                                    </NavLink>
                                </li>
                                <li className="nav-item">
                                    <NavLink
                                        to="/Profile"
                                        className="nav-link"
                                        onClick={toggleMenu}
                                    >
                                        Profile
                                    </NavLink>
                                </li>
                            </ul>
                        )}
                    </div>

                    {/* Profile Button */}
                    <button
                        className="profile-btn"
                        onClick={() => navigate('/Profile')}
                        aria-label="Go to Profile page"
                    >
                        {avatarCustomization ? (
                            <BeanHead {...avatarCustomization} mask={false} />
                        ) : (
                            <img src="/book/book_images/user.png" alt="User" />
                        )}

                        <span className="sparkle sparkle-1">✨</span>
                        <span className="sparkle sparkle-2">✨</span>
                        <span className="sparkle sparkle-3">✨</span>
                        <div className="rank-banner">Gold Rank</div>
                    </button>
                </div>
            </nav>
        </header>
    );
};

export default NavBar;
