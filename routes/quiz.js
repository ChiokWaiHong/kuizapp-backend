const express = require('express');
const router = express.Router();
const { createQuiz, getQuizzes, getQuizById, deleteQuiz } = require('../controllers/quizController');
const protectedMiddleware = require('../middleware/protected');

// Routes for Quiz Management
router.post('/quiz', protectedMiddleware, createQuiz); // Create a quiz
router.get('/quizzes', protectedMiddleware, getQuizzes); // Get all quizzes
router.get('/quiz/:id', protectedMiddleware, getQuizById); // Get a specific quiz
router.delete('/quiz/:id', protectedMiddleware, deleteQuiz); // Delete a quiz

module.exports = router;
