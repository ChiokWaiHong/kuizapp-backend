// routes/auth.js
const express = require('express');
const { registerUser, verifyEmail, resendVerificationCode, loginUser, logoutUser } = require('../controllers/userController');
const router = express.Router();

router.post('/register', registerUser);
router.post('/verify-email', verifyEmail);
router.post('/resend-verification', resendVerificationCode);
router.post('/login', loginUser);
router.post('/logout', logoutUser);

module.exports = router;
