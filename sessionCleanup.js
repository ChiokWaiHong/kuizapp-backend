// sessionCleanup.js

const cron = require('node-cron');
const Session = require('./models/Session');
const { Op } = require('sequelize');

// Schedule cleanup every hour
cron.schedule('0 * * * *', async () => {
    try {
        const currentTime = new Date();
        await Session.destroy({
            where: {
                expires_at: {
                    [Op.lt]: currentTime, // Sessions expired before current time
                },
            },
        });
        console.log("Expired sessions cleaned up.");
    } catch (error) {
        console.error("Error cleaning up sessions:", error);
    }
});
