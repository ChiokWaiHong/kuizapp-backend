const { Quiz } = require('../models');

// Create a new quiz
exports.createQuiz = async (req, res) => {
  try {
    const { title, description, max_score } = req.body;
    const created_by = req.user.id; // Assuming JWT middleware adds `user` to the request
    const quiz = await Quiz.create({ title, description, max_score, created_by });
    res.status(201).json({ message: 'Quiz created successfully', quiz });
  } catch (error) {
    res.status(500).json({ message: 'Error creating quiz', error });
  }
};

// Fetch all quizzes
exports.getQuizzes = async (req, res) => {
  try {
    const quizzes = await Quiz.findAll({ where: { is_active: true } });
    res.status(200).json(quizzes);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching quizzes', error });
  }
};

// Fetch a single quiz by ID
exports.getQuizById = async (req, res) => {
  try {
    const quiz = await Quiz.findByPk(req.params.id);
    if (!quiz) return res.status(404).json({ message: 'Quiz not found' });
    res.status(200).json(quiz);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching quiz', error });
  }
};

// Delete a quiz
exports.deleteQuiz = async (req, res) => {
  try {
    const quiz = await Quiz.findByPk(req.params.id);
    if (!quiz) return res.status(404).json({ message: 'Quiz not found' });
    await quiz.destroy();
    res.status(200).json({ message: 'Quiz deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting quiz', error });
  }
};
