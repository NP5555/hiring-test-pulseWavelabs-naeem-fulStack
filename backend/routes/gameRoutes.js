const express = require('express');
const router = express.Router();
const GameResult = require('../models/GameResult');
const auth = require('../middleware/auth');

// Save game result
router.post('/results', auth, async (req, res) => {
  try {
    const { level, moves, timeSpent } = req.body;
    const gameResult = new GameResult({
      userId: req.user.id,
      level,
      moves,
      timeSpent
    });
    await gameResult.save();
    res.status(201).json(gameResult);
  } catch (error) {
    res.status(500).json({ message: 'Error saving game result', error: error.message });
  }
});

// Get game history for a user
router.get('/history', auth, async (req, res) => {
  try {
    const results = await GameResult.find({ userId: req.user.id })
      .sort({ createdAt: -1 })
      .limit(10);
    res.json(results);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching game history', error: error.message });
  }
});

// Get leaderboard
router.get('/leaderboard', async (req, res) => {
  try {
    const { level = 'easy' } = req.query;
    const leaderboard = await GameResult.aggregate([
      { $match: { level, completed: true } },
      {
        $group: {
          _id: '$userId',
          bestScore: { $min: '$moves' },
          bestTime: { $min: '$timeSpent' },
          gamesPlayed: { $sum: 1 }
        }
      },
      { $sort: { bestScore: 1, bestTime: 1 } },
      { $limit: 10 }
    ]);
    res.json(leaderboard);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching leaderboard', error: error.message });
  }
});

module.exports = router; 