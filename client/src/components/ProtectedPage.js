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
import Navbar2 from "./Navbar";
import Footer from "./Footer";
import Sidebar from "./Sidebar";
import SubHeader from "./SubHeader";
import io from "socket.io-client";
import notificationService from "../services/notification";
const { Content } = Layout;

function ProtectedPage({ children }) {
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";
	const { user } = useSelector((state) => state.users);

	const [isSidebarOpen, setIsSidebarOpen] = useState(true);

	let socket = null;
	console.log("API URL:", BASE_URL);
	const getUser = async () => {
		try {
			dispatch(SetLoading(true));
			const response = await userService.authenticate();
			dispatch(SetLoading(false));
			if (response.success) {
				dispatch(SetUser(response.data));

				await fetchNotifications();
				setupWebSocket(response.data._id, dispatch);
			} else {
				throw new Error(response.message);
			}
		} catch (error) {
			dispatch(SetLoading(false));
			// message.error(error.message);
			navigate("/login");
		}
	};

	const setupWebSocket = (userId, dispatch) => {
		if (!socket) {
			socket = io(BASE_URL);
			socket.emit("register", userId);

			socket.on("new-notification", (notification) => {
				dispatch(AddNotification(notification));
			});
		}
	};

	const disconnectWebSocket = () => {
		if (socket) {
			socket.disconnect();
			socket = null;
		}
	};

	const handleLogout = () => {
		try {
			userService.logout();
			dispatch(LogoutUser());

			disconnectWebSocket();
			navigate("/login");
		} catch (error) {
			console.error("Błąd podczas próby wylogowania:", error);
		}
	};

	const toggleSidebar = () => {
		setIsSidebarOpen(!isSidebarOpen);
	};

	const fetchNotifications = async () => {
		try {
			const response = await notificationService.getNotifications();
			if (response.success) {
				dispatch(SetNotifications(response.data));
			} else {
				throw new Error(response.message);
			}
		} catch (error) {
			console.error("Błąd podczas próby pobrania powiadomień:", error);
		}
	};

	useEffect(() => {
		getUser();
		return () => {
			socket?.disconnect();
		};
	}, []);

	return (
		user && (
			<Layout className="min-h-screen flex flex-col">
				<Navbar2
					user={user}
					toggleSidebar={toggleSidebar}
					handleLogout={handleLogout}
				/>
				<SubHeader user={user} />
				<Content className="flex-1 flex overflow-hidden">
					<Row className="flex-1 w-full">
						<Col span={6} className="flex flex-col h-full pr-3">
							<Sidebar user={user} isSidebarOpen={isSidebarOpen} />
						</Col>
						<Col span={18} className="flex flex-col overflow-auto p-3">
							{children}
						</Col>
					</Row>
				</Content>
				<Footer />
			</Layout>
		)
	);
}

export default ProtectedPage;
