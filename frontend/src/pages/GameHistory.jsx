import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import styles from './GameHistory.module.css';

const GameHistory = () => {
  const navigate = useNavigate();
  const [memoryHistory, setMemoryHistory] = useState([]);
  const [allHistory, setAllHistory] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [selectedLevel, setSelectedLevel] = useState('easy');
  const [activeTab, setActiveTab] = useState('history');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    fetchMemoryHistory();
    fetchAllMemoryHistory();
    fetchLeaderboard();
  }, [selectedLevel]);

  const fetchMemoryHistory = async () => {
    setIsLoading(true);
    setErrorMsg('');
    try {
      const userID = localStorage.getItem('userID');
      console.log('Fetching memory history with userID:', userID);
      
      if (!userID) {
        console.error('No userID found in localStorage');
        setErrorMsg('User ID not found. Please log in again.');
        setIsLoading(false);
        return;
      }
      
      const response = await axios.get(`http://localhost:5001/api/memory/history/${userID}`);
      console.log('Memory history response:', response.data);
      setMemoryHistory(response.data);
    } catch (error) {
      console.error('Error fetching memory history:', error.response?.data || error.message);
      setErrorMsg('Failed to load your game history. Using public records instead.');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchAllMemoryHistory = async () => {
    try {
      console.log('Fetching all memory history');
      const response = await axios.get('http://localhost:5001/api/memory/all-history');
      console.log('All memory history:', response.data);
      setAllHistory(response.data);
    } catch (error) {
      console.error('Error fetching all memory history:', error.response?.data || error.message);
    }
  };

  const fetchLeaderboard = async () => {
    try {
      const response = await axios.get(`http://localhost:5001/api/game/leaderboard?level=${selectedLevel}`);
      setLeaderboard(response.data);
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
    }
  };

  const formatTime = (seconds) => {
    if (!seconds) return '0:00';
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleBackToMenu = () => {
    navigate('/play');
  };

  // Determine which history to display
  const displayHistory = memoryHistory.length > 0 ? memoryHistory : allHistory;
  const isShowingPublicRecords = memoryHistory.length === 0 && allHistory.length > 0;

  return (
    <div className={styles.pageBackground}>
      <div className={styles.container}>
        <h1 className={styles.gameTitle}>Game Records</h1>
        
        <div className={styles.tabs}>
          <button
            className={`${styles.tab} ${activeTab === 'history' ? styles.active : ''}`}
            onClick={() => setActiveTab('history')}
          >
            My History
          </button>
          <button
            className={`${styles.tab} ${activeTab === 'leaderboard' ? styles.active : ''}`}
            onClick={() => setActiveTab('leaderboard')}
          >
            Leaderboard
          </button>
        </div>

        {activeTab === 'history' ? (
          <div className={styles.history}>
            <h2>Game History</h2>
            {errorMsg && <p className={styles.errorMessage}>{errorMsg}</p>}
            {isShowingPublicRecords && <p className={styles.infoMessage}>Showing all game records.</p>}
            
            {isLoading ? (
              <div className={styles.loadingContainer}>
                <p>Loading your game history...</p>
              </div>
            ) : (
              <div className={styles.grid}>
                {displayHistory.length > 0 ? (
                  displayHistory.map((game, index) => (
                    <div key={index} className={styles.card}>
                      <h3>{game.difficulty}</h3>
                      <p>Failed Attempts: {game.failed}</p>
                      <p>Time: {formatTime(game.timeTaken)}</p>
                      <p className={`${styles.completed} ${game.completed ? styles.completedSuccess : styles.completedFail}`}>
                        {game.completed ? "Completed" : "Abandoned"}
                      </p>
                      <p className={styles.date}>
                        {new Date(game.gameDate).toLocaleDateString()}
                      </p>
                    </div>
                  ))
                ) : (
                  <div className={styles.noRecords}>
                    <p>No game records found. Start playing to record your progress!</p>
                  </div>
                )}
              </div>
            )}
          </div>
        ) : (
          <div className={styles.leaderboard}>
            <h2>Leaderboard</h2>
            <div className={styles.levelSelector}>
              {['easy', 'medium', 'hard'].map((level) => (
                <button
                  key={level}
                  className={`${styles.levelButton} ${selectedLevel === level ? styles.selected : ''}`}
                  onClick={() => setSelectedLevel(level)}
                >
                  {level.charAt(0).toUpperCase() + level.slice(1)}
                </button>
              ))}
            </div>
            <div className={styles.table}>
              <div className={styles.tableHeader}>
                <span>Rank</span>
                <span>Best Score</span>
                <span>Best Time</span>
                <span>Games</span>
              </div>
              {leaderboard.length > 0 ? (
                leaderboard.map((entry, index) => (
                  <div key={index} className={styles.tableRow}>
                    <span>#{index + 1}</span>
                    <span>{entry.bestScore} moves</span>
                    <span>{formatTime(entry.bestTime)}</span>
                    <span>{entry.gamesPlayed}</span>
                  </div>
                ))
              ) : (
                <div className={styles.noRecords}>
                  <p>No leaderboard data available for this level yet.</p>
                </div>
              )}
            </div>
          </div>
        )}
        
        <button className={styles.backButton} onClick={handleBackToMenu}>
          Back to Menu
        </button>
      </div>
    </div>
  );
};

export default GameHistory; 