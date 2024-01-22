// Redux slice for user
import { createSlice } from "@reduxjs/toolkit";
const usersSlice = createSlice({
	name: "users",
	initialState: {
		user: null,
		allUsers: [],
		notifications: [],
	},
	reducers: {
		SetUser(state, action) {
			state.user = action.payload;
		},
		// SetAllUsers(state, action) {
		// 	state.allUsers = action.payload;
		// },
		SetNotifications(state, action) {
			state.notifications = action.payload;
		},
		LogoutUser(state) {
			state.user = null;
		},
		AddNotification(state, action) {
			state.notifications.push(action.payload);
		},
		RemoveNotification(state, action) {
			state.notifications = state.notifications.filter(
				(notification) => notification._id !== action.payload
			);
		},
		MarkNotificationAsRead(state, action) {
			state.notifications = state.notifications.map((notification) =>
				notification._id === action.payload
					? { ...notification, read: true }
					: notification
			);
		},
		ClearNotifications(state) {
			state.notifications = [];
		},
	},
});

export const {
	SetUser,
	SetAllUsers,
	SetNotifications,
	LogoutUser,
	AddNotification,
	RemoveNotification,
	MarkNotificationAsRead,
	ClearNotifications,
} = usersSlice.actions;

export default usersSlice.reducer;
