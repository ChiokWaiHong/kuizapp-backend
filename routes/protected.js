// routes/protected.js
const express = require('express');
const extendSessionExpiry = require('../middleware/extendSessionExpiry');
const router = express.Router();

router.use(extendSessionExpiry); // Apply session expiry extension middleware

// Define protected routes
router.get('/some-protected-route', (req, res) => {
  res.json({ message: 'This is a protected route.', user: req.session.user_id });
});

module.exports = router;
