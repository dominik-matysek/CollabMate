const Log = require('../models/log');

exports.getAllLogs = async (req, res) => {
  try {
    const logs = await Log.find()
      .select('userId action ipAddress createdAt')
      .sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: logs });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};