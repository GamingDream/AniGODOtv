const mongoose = require('mongoose');

const seasonSchema = new mongoose.Schema({
  anime: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Anime',
    required: true
  },
  seasonNumber: {
    type: Number,
    required: true
  },
  seasonName: {
    type: String,
    default: ''
  },
  episodeCount: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Ensure unique season number per anime
seasonSchema.index({ anime: 1, seasonNumber: 1 }, { unique: true });

module.exports = mongoose.model('Season', seasonSchema);