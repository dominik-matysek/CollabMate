import React from "react";
import { TeamOutlined, HomeOutlined, UserOutlined } from "@ant-design/icons";
import SidebarItem from "./SidebarItem";

function Sidebar({ user, isSidebarOpen }) {
	const userRole = user.role;

	const items = [
		{
			name: "Panel główny",
			icon: <HomeOutlined />,
			link: "/teams",
			current: true,
		},
		{
			name: "Profil",
			link: `/profile/${user._id}`,
			icon: <UserOutlined />,
			current: false,
		},
	];

	if (userRole === "ADMIN") {
		items.push({
			name: "Użytkownicy",
			link: "/users",
			icon: <TeamOutlined />,
			current: false,
		});
	} else if (user?.team) {
		items.push({
			name: "Zespół",
			link: `/teams/${user?.team?._id}`,
			icon: <TeamOutlined />,
			current: false,
		});
	}

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
