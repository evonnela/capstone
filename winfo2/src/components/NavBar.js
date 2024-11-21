import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { signOut, getAuth } from 'firebase/auth';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';

const NavBar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation(); // This hook helps track the current location

  // Handle sign out
  const handleSignOut = () => {
    signOut(getAuth())
      .then(() => {
        setIsMenuOpen(false);
        window.alert("Signed Out");
        navigate('/');
      })
      .catch((error) => {
        console.error('Error signing out:', error);
      });
  };

  // Toggle menu visibility
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Close menu when screen width is greater than 992px or route changes
  const handleResize = () => {
    if (window.innerWidth > 992) {
      setIsMenuOpen(false); // Close the menu if the screen is wider than 992px
    }
  };

  // Reset the menu state when the page changes
  useEffect(() => {
    setIsMenuOpen(false); // Hide menu when route changes
  }, [location]);

  // Add event listener to window resize
  useEffect(() => {
    window.addEventListener('resize', handleResize);

    // Cleanup the event listener on unmount
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

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

          <button
            className="navbar-toggler"
            type="button"
            aria-expanded={isMenuOpen}
            aria-label="Toggle navigation"
            onClick={toggleMenu}
          >
            <FontAwesomeIcon icon={faBars} />
          </button>

          <div className={navbarClassName} id="navbarSupportedContent">
            <ul className="navbar-nav">
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

          <button
            className="profile-btn"
            onClick={() => navigate('/Profile')}
            aria-label="Go to Profile page"
          >
            <img src="/book/book_images/user.png" alt="User" />
          </button>
        </div>
      </nav>
    </header>
  );
};

export default NavBar;