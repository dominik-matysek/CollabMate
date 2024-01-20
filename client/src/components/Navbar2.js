import React, { useState } from "react";
import {
	Input,
	Button,
	Avatar,
	Badge,
	Divider,
	Menu,
	Dropdown,
	message,
} from "antd";
import {
	MenuOutlined,
	BellOutlined,
	UserOutlined,
	CloseOutlined,
	CheckOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import notificationService from "../services/notification";
import {
	ClearNotifications,
	MarkNotificationAsRead,
	RemoveNotification,
} from "../redux/usersSlice";
import { SetLoading } from "../redux/loadersSlice";

const { Search } = Input;

const Navbar = ({ user, toggleSidebar, handleLogout }) => {
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const notifications = useSelector((state) => state.users.notifications);

	const onMenuClick = (event) => {
		const { key } = event;
		if (key === "logout") {
			handleLogout();
		} else if (key === "profile") {
			navigate(`/profile/${user._id}`);
		}
	};

	const menu = (
		<Menu onClick={onMenuClick}>
			<Menu.Item key="profile">Twój profil, {user.firstName}</Menu.Item>
			<Menu.Item key="logout">Wyloguj się</Menu.Item>
		</Menu>
	);

	const handleDeleteNotification = async (event, notificationId) => {
		event.stopPropagation();
		try {
			const response = await notificationService.deleteNotification(
				notificationId
			);
			if (response.success) {
				dispatch(RemoveNotification(notificationId));
			} else {
				throw new Error(response.message);
			}
		} catch (error) {
			message.error(error.message);
		}
	};

	const handleMarkAsRead = async (event, notificationId) => {
		event.stopPropagation();
		try {
			const response = await notificationService.markNotificationAsRead(
				notificationId
			);
			if (response.success) {
				dispatch(MarkNotificationAsRead(notificationId));
			} else {
				throw new Error(response.message);
			}
		} catch (error) {
			message.error(error.message);
		}
	};

	const removeAllNotifications = async (event) => {
		// event.stopPropagation();
		try {
			const response = await notificationService.deleteAllNotifications();
			if (response.success) {
				dispatch(ClearNotifications());
			} else {
				throw new Error(response.message);
			}
		} catch (error) {
			message.error(error.message);
		}
	};

	const handleNotificationClick = (notification) => {
		navigate(notification.link);
	};

	const notificationMenu =
		notifications.length > 0 ? (
			<Menu>
				{notifications.map((notification, index) => (
					<Menu.Item
						key={index}
						onClick={() => handleNotificationClick(notification)}
						className={`flex flex-col justify-start ${
							!notification.read ? "bg-blue-100" : ""
						}`}
					>
						<div className="flex justify-between items-center">
							<p className="font-bold my-auto">{notification.title}</p>
							<div className="flex items-center space-x-2">
								{!notification.read && (
									<Button
										icon={<CheckOutlined />}
										onClick={(e) => handleMarkAsRead(e, notification._id)}
										size="small"
										type="text"
										className="text-green-800"
									/>
								)}

								<Button
									icon={<CloseOutlined />}
									danger
									onClick={(e) => handleDeleteNotification(e, notification._id)}
									size="small"
									type="text"
								/>
							</div>
						</div>
						<div>
							<p>{notification.description}</p>
							{notification.read ? (
								<span className="text-gray-500">Przeczytano</span>
							) : (
								<span className="text-blue-500">Nowe</span>
							)}
						</div>
					</Menu.Item>
				))}
				<Menu.Divider />
				<Menu.Item key="removeAll">
					<div
						onClick={removeAllNotifications}
						className="text-center text-red-600 "
					>
						Usuń powiadomienia
					</div>
				</Menu.Item>
			</Menu>
		) : (
			<Menu>
				<Menu.Item key="noNotifications">
					<div className="text-center text-gray-500">No notifications</div>
				</Menu.Item>
			</Menu>
		);

	return (
		<div className="flex items-center justify-between px-6 py-4 bg-white shadow-md">
			<div className="flex items-center">
				{/* Button to toggle the sidebar */}
				<Button
					className="mr-4"
					onClick={toggleSidebar}
					icon={<MenuOutlined />}
					style={{ width: "4em" }}
				/>
				{/* Brand logo or name */}
				<div
					className="text-xl font-bold mx-4 cursor-pointer"
					onClick={() => navigate("/")}
				>
					CollaboMate
				</div>

				{/* Vertical divider */}

				<Divider
					type="vertical"
					className="border-gray-400 mx-4 align-middle"
					style={{ height: "20px" }}
				/>

				{/* Search bar */}

				<Search
					className="mx-4"
					placeholder="Użytkownicy i zespoły"
					enterButton="Search"
					size="large"
					onSearch={(value) => console.log(value)}
				/>
			</div>
			<div className="flex items-center pr-10">
				{/* Notifications bell icon */}
				<Dropdown
					overlay={notificationMenu}
					trigger={["click"]}
					placement="bottomRight"
				>
					<Badge
						count={
							notifications.filter((notification) => !notification.read).length
						}
						size="small"
						className="cursor-pointer mr-6"
					>
						<BellOutlined className="text-2xl " />
					</Badge>
				</Dropdown>
				{/* <Badge
					count={
						notifications.filter((notification) => !notification.read).length
					}
					size="small"
					className="cursor-pointer mr-6"
				>
					<BellOutlined className="text-2xl " />
				</Badge> */}

				{/* Profile picture */}
				<Dropdown overlay={menu} trigger={["click"]}>
					<a onClick={(e) => e.preventDefault()}>
						{user.profilePic ? (
							<Avatar src={user.profilePic} className="cursor-pointer" />
						) : (
							<Avatar icon={<UserOutlined />} className="cursor-pointer" />
						)}
					</a>
				</Dropdown>
			</div>
		</div>
	);
};

export default Navbar;
