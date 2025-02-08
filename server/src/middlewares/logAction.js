const Log = require('../models/log');

const logAction = async (userId, action, ipAddress) => {
    try {
        const logEntry = new Log({
          userId,
          action,
          ipAddress,
        });
      
        await logEntry.save();
    } catch (error) {
        console.error("Error logging action: ", error);
    }
};

module.exports = logAction;