import { Col, Row, message, Layout } from "antd";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import userService from "../services/user";
import {
	SetNotifications,
	SetUser,
	LogoutUser,
	AddNotification,
} from "../redux/usersSlice";
import { SetLoading } from "../redux/loadersSlice";
// import { GetAllNotifications } from "../apicalls/notifications";
import { Avatar, Badge, Space } from "antd";
import Navbar2 from "./Navbar2";
import Footer from "./Footer";
import Sidebar from "./Sidebar2";
import Profile from "../pages/Profile";
import SubHeader from "./SubHeader";

const { Content } = Layout;

function ProtectedPage({ children }) {
	// const [showNotifications, setShowNotifications] = useState(false);
	const navigate = useNavigate();
	const dispatch = useDispatch();

	return (
		user && (
			<Layout className="min-h-screen flex flex-col">
				<Navbar2
					user={user}
					toggleSidebar={toggleSidebar}
					handleLogout={handleLogout}
				/>
				<SubHeader user={user} />
				<Content className="flex-1 flex overflow-hidden">{children}</Content>
				<Footer />
			</Layout>
		)
	);
}

export default UnprotectedPage;
