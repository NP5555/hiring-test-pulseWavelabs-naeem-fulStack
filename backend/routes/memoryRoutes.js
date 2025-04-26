const express = require('express');
const { saveGameData } = require('../controllers/memoryController');
const router = express.Router();
const Save = require('../models/save');
const mongoose = require('mongoose');

// Route to save game data
router.post('/save', saveGameData);

// Debug route to get all history
router.get('/all-history', async (req, res) => {
  try {
    const allHistory = await Save.find().limit(50);
    console.log('Total history items found:', allHistory.length);
    res.status(200).json(allHistory);
  } catch (error) {
    console.error('Error fetching all history:', error);
    res.status(500).json({ message: 'Error fetching all history', error: error.message });
  }
});

// Route to fetch memory game history by userID
router.get('/history/:userID', async (req, res) => {
  console.log('Fetching history for userID:', req.params.userID);
  try {
    const { userID } = req.params;
    if (!userID) {
      return res.status(400).json({ message: 'User ID is required' });
    }

    console.log('Looking up history with userID:', userID);
    
    let userObjectId;
    try {
      userObjectId = new mongoose.Types.ObjectId(userID);
    } catch (error) {
      console.error('Invalid ObjectId format:', userID);
      return res.status(400).json({ message: 'Invalid user ID format' });
    }
    
    // Find history using ObjectId
    const history = await Save.find({ userID: userObjectId })
      .sort({ gameDate: -1 })
      .limit(20);
    
    console.log('Found history items:', history.length);
    
    res.status(200).json(history);
  } catch (error) {
    console.error('Error fetching memory game history:', error);
    res.status(500).json({ message: 'Error fetching memory game history', error: error.message });
  }
});

module.exports = router;
