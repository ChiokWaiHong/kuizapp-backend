const express = require('express');
const https = require('https');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const sequelize = require('./config/database');
const User = require('./models/User');
require('dotenv').config();  // Load .env variables
require('./sessionCleanup');

const authMiddleware = require('./middleware/authMiddleware');  // Import authMiddleware
const extendSessionExpiry = require('./middleware/extendSessionExpiry'); // Import extendSessionExpiry
const app = express();
app.use(cors());
app.use(express.json());

// Load SSL certificate and key
const sslOptions = {
  key: fs.readFileSync(path.join(__dirname, 'localhost.key')),
  cert: fs.readFileSync(path.join(__dirname, 'localhost.crt'))
};

// Public Routes (no authentication required)
const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);

// Protected Routes (apply authMiddleware and extendSessionExpiry to all routes under /api/protected)
const protectedRoutes = require('./routes/protected');
app.use('/api/protected', authMiddleware, extendSessionExpiry, protectedRoutes); // Ensure these routes require authentication and extend session expiry



const quizRoutes = require('./routes/quiz');
// Add the quiz routes
app.use('/api', quizRoutes);


const quizParticipationRoutes = require('./routes/quizParticipation');

// Add quiz participation routes
app.use('/api', quizParticipationRoutes);





// Health Check
app.get('/', (req, res) => {
  res.send('KuizApp Backend is running with HTTPS!');
});

// Start HTTPS server on port 443
https.createServer(sslOptions, app).listen(443, () => {
  console.log('KuizApp Backend HTTPS server running on https://localhost');
});

// Sync the database (create/update tables based on models)
sequelize.sync({ force: false }).then(() => {
  console.log('Database & tables synced!');
});
