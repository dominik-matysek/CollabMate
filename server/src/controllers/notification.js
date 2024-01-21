const Notification = require("../models/notification");
const { getSocketIdForUser } = require("../config/websocket");

// Controller to create a new notification
exports.createNotification = async (req, res) => {
	try {
		const { title, description, link, users } = req.body;

		let createdNotifications = [];
		for (const userId of users) {
			const notification = await Notification.create({
				users: userId,
				title,
				description,
				link,
			});

			createdNotifications.push(notification);

			// Emit event to specific user
			const socketId = getSocketIdForUser(userId);
			if (socketId) {
				req.app.io.to(socketId).emit("new-notification", notification);
			}
		}

		res.status(200).json({
			success: true,
			message: "Powiadomienie dodane",
			data: createdNotifications,
		});
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: "Internal Server Error" });
	}
};

// Controller to get all notifications for the authenticated user
exports.getNotifications = async (req, res) => {
	try {
		const userId = req.userId;

		// Get all notifications for the user, sorted with unread ones first
		const notifications = await Notification.find({ users: userId }).sort({
			read: 1,
			createdAt: -1,
		});

		res.status(200).json({
			success: true,
			data: notifications,
		});
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: "Internal Server Error" });
	}
};

// Controller to mark notifications as read
exports.readNotifications = async (req, res) => {
	try {
		const { notificationId } = req.params;
		const userId = req.userId;

		const notification = await Notification.findById(notificationId);
		if (!notification) {
			return res.status(404).json({ error: "Nie znaleziono powiadomienia." });
		}

		if (!notification.users.includes(userId)) {
			// If the notification does not belong to the user, deny the action
			return res.status(403).json({ error: "Brak dostępu." });
		}

		// Mark the notification as read
		notification.read = true;
		await notification.save();

		res.status(200).json({
			success: true,
			message: "Powiadomienia przeczytane",
		});
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: "Internal Server Error" });
	}
};

// Controller to delete a specific notification
exports.deleteNotification = async (req, res) => {
	try {
		const { notificationId } = req.params;
		const userId = req.userId; // Assuming req.userId is populated

		// Find the notification and check if it belongs to the user
		const notification = await Notification.findById(notificationId);
		if (!notification) {
			return res.status(404).json({ error: "Nie znaleziono powiadomienia." });
		}

		if (!notification.users.includes(userId)) {
			// If the notification does not belong to the user, deny the action
			return res.status(403).json({ error: "Brak dostępu." });
		}

		// Delete the notification since it belongs to the user
		await notification.deleteOne();

		res
			.status(200)
			.json({ success: true, message: "Pomyślnie usunięto powiadomienie." });
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: "Internal Server Error" });
	}
};

// Controller to delete all notifications for the authenticated user
exports.deleteAllNotifications = async (req, res) => {
	try {
		const userId = req.userId;

		// Delete all notifications for the user
		await Notification.deleteMany({ users: { $in: [userId] } });

		res.status(200).json({
			success: true,
			message: "Pomyślnie usunięto powiadomienia",
		});
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: "Internal Server Error" });
	}
};
