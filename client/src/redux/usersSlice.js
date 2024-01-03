// do ogarnięcia co sie tu dzieje i w ogole w calym folderze redux
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
      console.log("SetUser Payload: ", action.payload);
      state.user = action.payload;
    },
    SetAllUsers(state, action) {
      state.allUsers = action.payload;
    },
    SetNotifications(state, action) {
      state.notifications = action.payload;
    },
  },
});

export const { SetUser, SetAllUsers, SetNotifications } = usersSlice.actions;

export default usersSlice.reducer;
