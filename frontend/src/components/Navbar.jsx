import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import styles from './Navbar.module.css';

const Navbar = ({ onLogout }) => {
  const location = useLocation();

  return (
    <nav className={styles.navbar}>
      <div className={styles.logo}>
        Memory Game
      </div>
      <div className={styles.links}>
        <Link
          to="/play"
          className={`${styles.link} ${location.pathname === '/play' ? styles.active : ''}`}
        >
          Play
        </Link>
        <Link
          to="/history"
          className={`${styles.link} ${location.pathname === '/history' ? styles.active : ''}`}
        >
          History
        </Link>
        <button onClick={onLogout} className={styles.logoutButton}>
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar; 