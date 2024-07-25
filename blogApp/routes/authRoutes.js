const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const auth = require('../middleware/auth');

router.post('/signup', authController.signUp);
router.post('/login', authController.login);
router.post('/logout', auth, authController.logout);

module.exports = router;