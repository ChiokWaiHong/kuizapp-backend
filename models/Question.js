const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Question = sequelize.define('Question', {
  question_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  quiz_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  question_text: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  question_type: {
    type: DataTypes.ENUM('MCQ', 'TrueFalse', 'ShortAnswer'),
    allowNull: false,
  },
  options: {
    type: DataTypes.JSON, // For MCQs, store options as JSON
    allowNull: true,
  },
  correct_answer: {
    type: DataTypes.TEXT, // Correct answer for validation
    allowNull: true,
  },
}, {
  timestamps: true,
  tableName: 'Questions',
});

module.exports = Question;
