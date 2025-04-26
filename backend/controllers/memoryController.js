const Save = require('../models/save');
const mongoose = require('mongoose');

exports.saveGameData = async (req, res) => {
    const { userID, gameDate, failed, difficulty, completed, timeTaken } = req.body;

    console.log('Received data to save:', req.body); 

    try {
        if (!userID || !gameDate || difficulty === undefined || completed === undefined || timeTaken === undefined) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        // Verify userID is a valid ObjectId
        let userObjectId;
        try {
            userObjectId = new mongoose.Types.ObjectId(userID);
        } catch (error) {
            console.error('Invalid userID format:', userID);
            return res.status(400).json({ message: 'Invalid user ID format' });
        }

        const newSave = new Save({
            userID: userObjectId,
            gameDate,
            failed,
            difficulty,
            completed,
            timeTaken,
        });

        await newSave.save(); 
        res.status(201).json({ message: 'Game data saved successfully' });
    } catch (error) {
        console.error('Error saving game data:', error);
        res.status(500).json({ message: 'Error saving game data', error });
    }
};
