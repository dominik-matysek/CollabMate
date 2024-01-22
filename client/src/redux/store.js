import { configureStore } from "@reduxjs/toolkit";
import usersReducer from "./usersSlice";
import loadersReducer from "./loadersSlice";

// Redux store

const store = configureStore({
	reducer: {
		users: usersReducer,
		loaders: loadersReducer,
	},
});

export default store;
