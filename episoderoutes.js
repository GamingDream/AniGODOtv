const express = require('express');
const router = express.Router();
const {
  getEpisodeById,
  getEpisodeByAnimeAndSeason,
  createEpisode,
  updateEpisode,
  deleteEpisode,
  getLatestEpisodes
} = require('../controllers/episodeController');
const { protect } = require('../middleware/auth');

// Public routes
router.get('/latest', getLatestEpisodes);
router.get('/:id', getEpisodeById);
router.get('/:animeId/season/:seasonNumber/episode/:episodeNumber', getEpisodeByAnimeAndSeason);

// Admin routes
router.post('/', protect, createEpisode);
router.put('/:id', protect, updateEpisode);
router.delete('/:id', protect, deleteEpisode);

module.exports = router;