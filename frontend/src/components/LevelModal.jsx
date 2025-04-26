import React from 'react';
import styles from './LevelModal.module.css';

const LevelModal = ({ isOpen, onClose, onSelectLevel }) => {
  if (!isOpen) return null;

  const levels = [
    { id: 'easy', label: 'Easy', pairs: 6 },
    { id: 'medium', label: 'Medium', pairs: 8 },
    { id: 'hard', label: 'Hard', pairs: 12 }
  ];

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <h2>Select Difficulty Level</h2>
        <div className={styles.levelGrid}>
          {levels.map((level) => (
            <button
              key={level.id}
              className={styles.levelButton}
              onClick={() => {
                onSelectLevel(level.pairs);
                onClose();
              }}
            >
              <h3>{level.label}</h3>
              <p>{level.pairs} pairs of cards</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LevelModal; 