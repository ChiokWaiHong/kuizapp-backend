// middleware/extendSessionExpiry.js
const Session = require('../models/Session');

const extendSessionExpiry = async (req, res, next) => {
    const sessionId = req.body.sessionId || req.query.sessionId || req.headers['x-session-id'];

    if (!sessionId) {
        console.log('No session ID provided');
        return res.status(401).json({ error: 'Session ID required.' });
    }

    try {
        const session = await Session.findOne({ where: { session_id: sessionId } });

        if (!session) {
            console.log('Session not found'); // Log if session is not found
            return res.status(401).json({ error: 'Invalid session.' });
        }

        // Log current expiration time
        console.log(`Current expires_at: ${session.expires_at}`);

        // Check if the session has expired
        if (new Date(session.expires_at) < new Date()) {
            console.log('Session expired, deleting session'); // Log if session has expired
            await Session.destroy({ where: { session_id: sessionId } });
            return res.status(401).json({ error: 'Session expired. Please log in again.' });
        }

        // Extend session by 1 hour for active users
        session.expires_at = new Date(Date.now() + 60 * 60 * 1000); // 1 hour from now
        await session.save();

        // Log new expiration time
        console.log(`New expires_at: ${session.expires_at}`);

        req.session = session; // Attach session to request for further use
        next();
    } catch (error) {
        console.error('Session extension error:', error);
        res.status(500).json({ error: 'Server error during session extension.' });
    }
};

module.exports = extendSessionExpiry;
