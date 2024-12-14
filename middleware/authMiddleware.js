// middleware/authMiddleware.js
const Session = require('../models/Session');
const jwt = require('jsonwebtoken');

const authMiddleware = async (req, res, next) => {
  const token = req.header('Authorization');
  if (!token) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  try {
    const decoded = jwt.verify(token, 'jwtSecret'); // Assumes 'jwtSecret' is the JWT key
    const session = await Session.findOne({ where: { jwt_token: token } });

    if (!session) {
      return res.status(401).json({ msg: 'Session not found, authorization denied' });
    }

    const currentTime = new Date();
    if (currentTime > new Date(session.expires_at)) {
      await Session.destroy({ where: { session_id: session.session_id } }); // Cleans up expired session
      return res.status(401).json({ msg: 'Session expired, please log in again' });
    }

    req.user = decoded.userId; // Attach user info to the request
    next();
  } catch (err) {
    res.status(401).json({ msg: 'Token is not valid' });
  }
};

module.exports = authMiddleware;
