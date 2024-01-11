import React, { useState } from "react";
import { Input, Button, Avatar, Badge, Divider, Menu, Dropdown } from "antd";
import { MenuOutlined, BellOutlined, UserOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

const { Search } = Input;

const Navbar = ({ user, toggleSidebar, handleLogout }) => {
	const navigate = useNavigate();

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
				<Badge count={5} size="small" className="cursor-pointer mr-6">
					<BellOutlined className="text-2xl " />
				</Badge>

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
