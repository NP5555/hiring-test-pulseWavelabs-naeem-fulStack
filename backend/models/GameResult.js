const mongoose = require('mongoose');

const gameResultSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  level: {
    type: String,
    required: true,
    enum: ['easy', 'medium', 'hard']
  },
  moves: {
    type: Number,
    required: true
  },
  timeSpent: {
    type: Number,
    required: true
  },
  completed: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Index for faster queries
gameResultSchema.index({ userId: 1, createdAt: -1 });

const GameResult = mongoose.model('GameResult', gameResultSchema);

module.exports = GameResult; 