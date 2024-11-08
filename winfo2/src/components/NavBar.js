import React from 'react';
import { Link } from 'react-router-dom';
import "../index.css";

const NavBar = () => {
  return (
    <div className="navbar">
      <div className="navbar-content">
        <h1 className="nav-title">
          <Link to="/" aria-label="home">Level Up Learning</Link>
        </h1>
        <Link to="/Profile" aria-label="profile" className="circle"></Link>
      </div>
    </div>
  );
};

export default NavBar;