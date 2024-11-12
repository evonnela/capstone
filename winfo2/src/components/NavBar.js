import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { signOut, getAuth } from 'firebase/auth';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';

const NavBar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleSignOut = () => {
    signOut(getAuth())
      .then(() => {
        setIsMenuOpen(false);  // Close the menu after sign out
        window.alert("Signed Out");
        navigate('/');
      })
      .catch((error) => {
        console.error('Error signing out:', error);
      });
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen); 
  };

  const navbarClassName = isMenuOpen ? 'navbar-nav show' : 'navbar-nav';

  return (
    <header className="container-fluid">
      <nav className="navbar navbar-expand-lg">
        <div className="container-fluid">
          <a className="navbar-brand" href="/" aria-label="Website logo">
            <img src="/book/book_images/logo.png" alt="logo" />
          </a>

          {/* Hamburger Menu Button (For small screens) */}
          <button
            className="navbar-toggler"
            type="button"
            aria-expanded={isMenuOpen}
            aria-label="Toggle navigation"
            onClick={toggleMenu}
          >
            <FontAwesomeIcon icon={faBars} />
          </button>

          {/* Navbar Links */}
          <div className={navbarClassName} id="navbarSupportedContent">
            <ul className="navbar-nav">
              <li className="nav-item">
                <NavLink to="/Home" className="nav-link" onClick={toggleMenu}>
                  Library
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink to="/Book" className="nav-link" onClick={toggleMenu}>
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
              <li className="nav-item">
                <button className="nav-link btn sign-in-btn" onClick={handleSignOut}>
                  Sign Out
                </button>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </header>
  );
}

export default NavBar;