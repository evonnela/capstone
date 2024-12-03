import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { signOut, getAuth } from 'firebase/auth';
import { getDatabase, ref, get } from 'firebase/database';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import { BeanHead } from 'beanheads'; // Used for rendering the avatar

const NavBar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [avatarCustomization, setAvatarCustomization] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Fetch saved avatar customization from Firebase
  useEffect(() => {
    const db = getDatabase();
    const userId = "exampleUserId"; // Replace with actual user ID

    const avatarRef = ref(db, `users/${userId}/avatarCustomization`);
    get(avatarRef)
      .then((snapshot) => {
        if (snapshot.exists()) {
          setAvatarCustomization(snapshot.val());
        } else {
          console.log("No saved avatar found");
        }
      })
      .catch((error) => {
        console.error("Error fetching avatar customization:", error);
      });
  }, []);

  // Handle sign out
  const handleSignOut = () => {
    signOut(getAuth())
      .then(() => {
        setIsMenuOpen(false);
        alert("Signed Out");
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
          <a className="navbar-brand" href="/" aria-label="Website logo">
            <img src="/book/book_images/logo.png" alt="logo" />
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
          <div className={navbarClassName} id="navbarSupportedContent">
            <ul className="navbar-nav">
              <li className="nav-item">
                <NavLink to="/Home" className="nav-link" onClick={toggleMenu}>
                  Library
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink to="/CharacterBuilding" className="nav-link" onClick={toggleMenu}>
                  Build Character
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink to="/MarketPlace" className="nav-link" onClick={toggleMenu}>
                  Market Place
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink to="/About" className="nav-link" onClick={toggleMenu}>
                  About
                </NavLink>
              </li>
            </ul>

            {/* Vertically aligned NavLinks when the menu is open */}
            {isMenuOpen && (
              <ul className="navbar-nav vertical-nav">
                <li className="nav-item">
                  <NavLink to="/Home" className="nav-link" onClick={toggleMenu}>
                    Library
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink to="/Book/" className="nav-link" onClick={toggleMenu}>
                    Book
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink to="/Quiz" className="nav-link" onClick={toggleMenu}>
                    Quiz
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink to="/CharacterBuilding" className="nav-link" onClick={toggleMenu}>
                    Character Building
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink to="/MarketPlace" className="nav-link" onClick={toggleMenu}>
                    Market Place
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink to="/Profile" className="nav-link" onClick={toggleMenu}>
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

            {/* Sparkles */}
            <span className="sparkle sparkle-1">✨</span>
            <span className="sparkle sparkle-2">✨</span>
            <span className="sparkle sparkle-3">✨</span>

            {/* Rank Banner */}
            <div className="rank-banner">Gold Rank</div>
          </button>
        </div>
      </nav>
    </header>
  );
};

export default NavBar;