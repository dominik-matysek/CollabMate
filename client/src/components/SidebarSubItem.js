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

function SidebarSubItem({ name, underItems, level }) {
	const [collapsed, setCollapsed] = useState(true);

	const toggleCollapse = () => {
		if (underItems) {
			setCollapsed(!collapsed);
		}
	};

	return (
		<div>
			<div
				className={`pl-${
					level * 4
				} p-2 text-gray-500 hover:bg-gray-300 cursor-pointer`}
				onClick={toggleCollapse}
			>
				{name}
				{underItems &&
					(collapsed ? (
						<DownOutlined className="ml-2" />
					) : (
						<UpOutlined className="ml-2" />
					))}
			</div>
			{!collapsed &&
				underItems &&
				underItems.map((item, index) => (
					<div
						key={index}
						className={`pl-${
							(level + 1) * 4
						} p-2 text-gray-400 hover:bg-gray-300 cursor-pointer`}
					>
						{item.name}
					</div>
				))}
		</div>
	);
}

export default SidebarSubItem;
