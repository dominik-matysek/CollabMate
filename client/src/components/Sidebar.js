import React from "react";
import { TeamOutlined, HomeOutlined, UserOutlined } from "@ant-design/icons";
import SidebarItem from "./SidebarItem";

function Sidebar({ user, isSidebarOpen }) {
	const items = [
		{
			name: "Panel główny",
			icon: <HomeOutlined />,
			link: "/",
			current: true,
		},
		{
			name: "Zespoły",
			link: "/teams",
			icon: <TeamOutlined />,
			current: false,
		},
		{
			name: "Profil",
			link: `/profile/${user._id}`,
			icon: <UserOutlined />,
			current: false,
		},
	];
	return (
		isSidebarOpen && (
			<div
				className={`bg-white shadow-lg rounded-r-lg h-full transition-opacity duration-500 ease-out z-20 ${
					isSidebarOpen ? "opacity-100" : "opacity-0"
				} min-w-[200px] lg:min-w-0`}
			>
				{items.map((item, index) => (
					<SidebarItem key={index} {...item} />
				))}
			</div>
		)
	);
}

export default Sidebar;
