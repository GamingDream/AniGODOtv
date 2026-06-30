const express = require('express');
const router = express.Router();
const { registerAdmin, loginAdmin, getAdminProfile, logoutAdmin } = require('../controllers/authController');
const { protect } = require('../middleware/auth');

router.post('/register', registerAdmin);
router.post('/login', loginAdmin);
router.get('/profile', protect, getAdminProfile);
router.post('/logout', protect, logoutAdmin);

module.exports = router;