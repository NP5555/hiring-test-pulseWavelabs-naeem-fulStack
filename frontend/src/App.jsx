import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './Login/Login';
import Register from './Register/Register';
import MemoryGame from './MemoryCardGame/MemoryGame';
import GameHistory from './pages/GameHistory';
import Navbar from './components/Navbar';
import './App.css';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token'));

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userID');
    setIsLoggedIn(false);
  };

  return (
    <Router>
      {isLoggedIn && <Navbar onLogout={handleLogout} />}
      <Routes>
        <Route
          path="/"
          element={
            isLoggedIn ? <Navigate to="/play" /> : <Login onLogin={handleLogin} />
          }
        />
        <Route path="/register" element={<Register />} />
        <Route
          path="/play"
          element={isLoggedIn ? <MemoryGame /> : <Navigate to="/" />}
        />
        <Route
          path="/history"
          element={isLoggedIn ? <GameHistory /> : <Navigate to="/" />}
        />
      </Routes>
    </Router>
  );
}

export default App;
