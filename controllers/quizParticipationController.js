const { Question, Result } = require('../models');

// Submit answers for a quiz
exports.submitAnswers = async (req, res) => {
  try {
    const { quiz_id, answers } = req.body;
    const user_id = req.user.id; // Assuming JWT middleware adds `user` to the request

    // Fetch all questions for the quiz
    const questions = await Question.findAll({ where: { quiz_id } });

    let score = 0;

    // Calculate the score
    questions.forEach((question) => {
      const userAnswer = answers[question.question_id];
      if (userAnswer && userAnswer === question.correct_answer) {
        score += 1; // Increment score for correct answers
      }
    });

    // Save the result in the database
    const result = await Result.create({
      user_id,
      quiz_id,
      score,
      completion_time: req.body.completion_time || null,
    });

    res.status(201).json({ message: 'Quiz submitted successfully', result });
  } catch (error) {
    res.status(500).json({ message: 'Error submitting quiz', error });
  }
};

// Fetch leaderboard for a quiz
exports.getLeaderboard = async (req, res) => {
  try {
    const { quiz_id } = req.params;

    // Fetch results sorted by score
    const leaderboard = await Result.findAll({
      where: { quiz_id },
      order: [['score', 'DESC'], ['completion_time', 'ASC']],
      include: ['User'], // Assuming you define an association with the User model
    });

    res.status(200).json(leaderboard);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching leaderboard', error });
  }
};
