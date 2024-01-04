const Notification = require("../models/notification");

// Controller to create a new notification
exports.createNotification = async (req, res) => {
  try {
    const { title, description, link, users } = req.body;

    // Create a new notification for each user
    const notifications = await Notification.create(
      users.map((userId) => ({
        user: userId,
        title,
        description,
        link,
      }))
    );

    res.status(200).json({
      success: true,
      message: "Powiadomienie dodane",
      data: notifications,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Controller to get notifications for the authenticated user
exports.getNotifications = async (req, res) => {
  try {
    const userId = req.user._id;

    // Get unread notifications for the user
    const unreadNotifications = await Notification.find({
      user: userId,
      read: false,
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: unreadNotifications,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Controller to mark notifications as read
exports.readNotifications = async (req, res) => {
  try {
    const userId = req.user._id;

    // Mark unread notifications as read for the user
    const notifications = await Notification.updateMany(
      { user: userId, read: false },
      { $set: { read: true } }
    );

    res.status(200).json({
      success: true,
      message: "Powiadomienia przeczytane",
      data: notifications,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Controller to delete a specific notification
exports.deleteNotification = async (req, res) => {
  try {
    const notificationId = req.params.id;

    // Delete the notification by ID
    const deletedNotification = await Notification.findByIdAndDelete(
      notificationId
    );

    if (!deletedNotification) {
      return res.status(404).json({ error: "Notification not found" });
    }

    res
      .status(200)
      .json({ success: true, message: "Notification deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Controller to delete all notifications for the authenticated user
exports.deleteAllNotifications = async (req, res) => {
  try {
    const userId = req.user._id;

    // Delete all notifications for the user
    await Notification.deleteMany({ user: userId });

    res
      .status(200)
      .json({
        success: true,
        message: "All notifications deleted successfully",
      });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
