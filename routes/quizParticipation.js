const express = require('express');
const router = express.Router();
const { submitAnswers, getLeaderboard } = require('../controllers/quizParticipationController');
const protectedMiddleware = require('../middleware/protected');

// Routes for Quiz Participation
router.post('/quiz/:id/submit', protectedMiddleware, submitAnswers); // Submit quiz answers
router.get('/quiz/:id/leaderboard', protectedMiddleware, getLeaderboard); // Fetch leaderboard

module.exports = router;
