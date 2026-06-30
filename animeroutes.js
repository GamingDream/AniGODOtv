const express = require('express');
const router = express.Router();
const {
  getAllAnime,
  getFeaturedAnime,
  getTrendingAnime,
  getAnimeById,
  getAnimeBySlug,
  createAnime,
  updateAnime,
  deleteAnime,
  getRecentAnime
} = require('../controllers/animeController');
const { protect } = require('../middleware/auth');

// Public routes
router.get('/', getAllAnime);
router.get('/featured', getFeaturedAnime);
router.get('/trending', getTrendingAnime);
router.get('/recent', getRecentAnime);
router.get('/slug/:slug', getAnimeBySlug);
router.get('/:id', getAnimeById);

// Admin routes
router.post('/', protect, createAnime);
router.put('/:id', protect, updateAnime);
router.delete('/:id', protect, deleteAnime);

module.exports = router;