import React, { useState } from "react";
import { Fragment } from "react";
import { Disclosure, Menu, Transition } from "@headlessui/react";
import { Button, Badge } from "antd";
import { Bars3Icon, BellIcon, XMarkIcon } from "@heroicons/react/24/outline";
import logo from "../assets/Logo.png";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { LogoutUser } from "../redux/usersSlice";
import { DownOutlined, UpOutlined } from "@ant-design/icons";
import SidebarSubItem from "./SidebarSubItem";

function SidebarItem({ name, link, icon, notifications, underItems }) {
	const navigate = useNavigate();

	return (
		<div>
			<div
				className="flex items-center justify-between p-2 text-lg text-gray-600 hover:bg-gray-200 cursor-pointer"
				style={{ marginBottom: "10px" }}
				onClick={() => navigate(link)}
			>
				<div className="flex items-center">
					<div className="flex items-center justify-center w-10 m-4">
						{name === "Powiadomienia" && notifications > 0 ? (
							<Badge count={notifications}>{icon}</Badge>
						) : (
							icon
						)}
					</div>
					<span className="ml-2">{name}</span>
				</div>
				{/* {underItems && (collapsed ? <DownOutlined /> : <UpOutlined />)} */}
			</div>
			{/* {!collapsed && (
				<div className="pl-4">
					{underItems.map((item, index) => (
						<div
							key={index}
							className="p-2 text-gray-600 hover:bg-gray-300 cursor-pointer"
						>
							{item.name}
						</div>
					))}
				</div>
			)} */}
			{/* {!collapsed &&
				underItems &&
				underItems.map((subItem, index) => (
					<SidebarSubItem key={index} {...subItem} level={1} />
				))} */}
		</div>
	);
}

export default SidebarItem;
