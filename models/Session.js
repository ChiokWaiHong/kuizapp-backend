// models/Session.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Session = sequelize.define('Session', {
  session_id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  jwt_token: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  expires_at: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  ip_address: {
    type: DataTypes.STRING(45),
  },
  user_agent: {
    type: DataTypes.TEXT,
  },
}, {
  timestamps: false, // Disable createdAt and updatedAt timestamps
  tableName: 'Sessions'
});

module.exports = Session;
