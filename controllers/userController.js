// controllers/userController.js
const User = require('../models/User');
const Session = require('../models/Session');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const sendVerificationEmail = require('../config/email');
const { addHours } = require('date-fns');
require('dotenv').config();

exports.registerUser = async (req, res) => {
    const { username, email, password } = req.body;
    try {
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        return res.status(400).json({ error: 'verification.errors.userExists' });
      }
  
      const [hashedPassword, verificationCode] = await Promise.all([
        bcrypt.hash(password, 10),
        crypto.randomBytes(3).toString('hex').toUpperCase()
      ]);
  
      const expirationTime = new Date();
      expirationTime.setHours(expirationTime.getHours() + 1);
  
      const newUser = await User.create({
        username,
        email,
        password: hashedPassword,
        verification_code: verificationCode,
        verification_code_expires: expirationTime,
        is_verified: false
      });
  
      sendVerificationEmail(email, verificationCode)
        .catch(err => console.error('Email sending failed:', err));
  
      res.status(201).json({ message: 'verification.success' });
    } catch (error) {
      console.error('Registration Error:', error);
      res.status(500).json({ error: 'verification.errors.serverError' });
    }
};

// Existing verifyEmail function in userController.js
exports.verifyEmail = async (req, res) => {
  const { code, email } = req.body;

  try {
    const user = await User.findOne({ where: { email, verification_code: code } });

    if (!user) {
      return res.status(400).json({ error: 'verification.errors.invalidCode' });
    }

    if (user.verification_code_expires < new Date()) {
      return res.status(400).json({ error: 'verification.errors.expiredCode' });
    }

    // Mark the user as verified
    user.is_verified = true;
    user.verification_code = null;
    user.verification_code_expires = null;
    await user.save();

    // Generate JWT token for the verified user
    const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });

    // **NEW: Delete any existing session for this user**
    await Session.destroy({ where: { user_id: user.id } });

    // Create a new session
    const session = await Session.create({
      user_id: user.id,
      jwt_token: token,
      expires_at: new Date(Date.now() + 60 * 1000), // 1 hour from now
      ip_address: req.ip,
      user_agent: req.headers['user-agent']
    });

    res.json({
      success: true,
      token,
      sessionId: session.session_id,
      user: { id: user.id, email: user.email, username: user.username },
      message: 'verification.success'
    });
  } catch (error) {
    console.error('Email Verification Error:', error);
    res.status(500).json({ error: 'verification.errors.serverError' });
  }
};


exports.resendVerificationCode = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(400).json({ error: 'verification.errors.invalidEmail' });
    }

    if (user.is_verified) {
      return res.status(400).json({ error: 'verification.errors.alreadyVerified' });
    }

    const newCode = crypto.randomBytes(3).toString('hex').toUpperCase();
    const expirationTime = addHours(new Date(), 1); // Code expires in 1 hour

    user.verification_code = newCode;
    user.verification_code_expires = expirationTime;
    await user.save();

    await sendVerificationEmail(email, newCode);

    res.status(200).json({ message: 'verification.resentSuccess' });
  } catch (error) {
    console.error('Resend Verification Error:', error);
    res.status(500).json({ error: 'verification.errors.serverError' });
  }
};

exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ where: { email } });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(400).json({ error: 'login.errors.invalidCredentials' });
    }

    const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });

    // **NEW: Delete any existing session for this user**
    await Session.destroy({ where: { user_id: user.id } });

    // Create a new session
    const session = await Session.create({
      user_id: user.id,
      jwt_token: token,
      expires_at: new Date(Date.now() + 60 * 1000),
      ip_address: req.ip,
      user_agent: req.headers['user-agent']
    });

    res.json({ success: true, token, sessionId: session.session_id, user: { id: user.id, email: user.email, username: user.username } });
  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({ error: 'login.errors.serverError' });
  }
};

// controllers/userController.js
exports.logoutUser = async (req, res) => {
  const { sessionId } = req.body;

  try {
    await Session.destroy({ where: { session_id: sessionId } });
    res.json({ message: 'Logout successful' });
  } catch (error) {
    console.error('Logout Error:', error);
    res.status(500).json({ error: 'logout.errors.serverError' });
  }
};