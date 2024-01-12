import { Col, Row, message, Layout } from "antd";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import userService from "../services/user";
import { SetNotifications, SetUser, LogoutUser } from "../redux/usersSlice";
import { SetLoading } from "../redux/loadersSlice";
// import { GetAllNotifications } from "../apicalls/notifications";
import { Avatar, Badge, Space } from "antd";
// import Notifications from "./Notifications";
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
	const { user, notifications } = useSelector((state) => state.users);
	console.log(`User in Protected Page ${user}`);
	const [isSidebarOpen, setIsSidebarOpen] = useState(true);

	const handleLogout = () => {
		try {
			userService.logout();
			dispatch(LogoutUser());
			console.log(`User after logout ${user}`);
			navigate("/login");
		} catch (error) {
			console.error("Logout failed", error);
		}
	};

	const toggleSidebar = () => {
		setIsSidebarOpen(!isSidebarOpen);
	};

	const getUser = async () => {
		try {
			dispatch(SetLoading(true));
			const response = await userService.authenticate();
			dispatch(SetLoading(false));
			if (response.success) {
				dispatch(SetUser(response.data));
			} else {
				throw new Error(response.message);
			}
		} catch (error) {
			dispatch(SetLoading(false));
			message.error(error.message);
			navigate("/login");
		}
	};

	useEffect(() => {
		getUser();
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
							{/* </Col> */}
							{/* <Col span={6} className="flex flex-col h-full">
							<AdditionalInfo />*/}
						</Col>
					</Row>
				</Content>
				<Footer />
			</Layout>
		)
	);
}

export default ProtectedPage;

// import { Col, Row, message, Layout } from "antd";
// import React, { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { useNavigate } from "react-router-dom";
// import userService from "../services/user";
// import { SetNotifications, SetUser, LogoutUser } from "../redux/usersSlice";
// import { SetLoading } from "../redux/loadersSlice";
// // import { GetAllNotifications } from "../apicalls/notifications";
// import { Avatar, Badge, Space } from "antd";
// // import Notifications from "./Notifications";
// import Navbar2 from "./Navbar2";
// import Footer from "./Footer";
// import Sidebar from "./Sidebar2";
// import Profile from "../pages/Profile";
// import SubHeader from "./SubHeader";
// const { Content } = Layout;

// function ProtectedPage({ children }) {
// 	// const [showNotifications, setShowNotifications] = useState(false);
// 	const navigate = useNavigate();
// 	const dispatch = useDispatch();
// 	const { user, notifications } = useSelector((state) => state.users);
// 	console.log(`User in Protected Page ${user}`);
// 	const [isSidebarOpen, setIsSidebarOpen] = useState(true);

// 	const handleLogout = () => {
// 		try {
// 			userService.logout();
// 			dispatch(LogoutUser());
// 			console.log(`User after logout ${user}`);
// 			navigate("/login");
// 		} catch (error) {
// 			console.error("Logout failed", error);
// 		}
// 	};

// 	const toggleSidebar = () => {
// 		setIsSidebarOpen(!isSidebarOpen);
// 	};

// 	const getUser = async () => {
// 		try {
// 			dispatch(SetLoading(true));
// 			const response = await userService.authenticate();
// 			dispatch(SetLoading(false));
// 			if (response.success) {
// 				dispatch(SetUser(response.data));
// 			} else {
// 				throw new Error(response.message);
// 			}
// 		} catch (error) {
// 			dispatch(SetLoading(false));
// 			message.error(error.message);
// 			navigate("/login");
// 		}
// 	};

// 	useEffect(() => {
// 		getUser();
// 	}, []);

// 	return (
// 		user && (
// 			<Layout className="min-h-screen flex flex-col">
// 				<Navbar2
// 					user={user}
// 					toggleSidebar={toggleSidebar}
// 					handleLogout={handleLogout}
// 				/>
// 				<SubHeader user={user} />
// 				<Content className="flex-1 flex overflow-hidden">
// 					<Row className="flex-1 w-full">
// 						<Col span={6} className="flex flex-col h-full pr-3">
// 							<Sidebar user={user} isSidebarOpen={isSidebarOpen} />
// 						</Col>
// 						<Col span={18} className="flex flex-col overflow-auto p-3">
// 							{children}
// 							{/* </Col> */}
// 							{/* <Col span={6} className="flex flex-col h-full">
// 							<AdditionalInfo />*/}
// 						</Col>
// 					</Row>
// 				</Content>
// 				<Footer />
// 			</Layout>
// 		)
// 	);
// }

// export default ProtectedPage;
