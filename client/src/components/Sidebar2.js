import React from "react";
import {
	TeamOutlined,
	HomeOutlined,
	UserOutlined,
	BellTwoTone,
	FundProjectionScreenOutlined,
	SafetyCertificateOutlined,
	SmileOutlined,
	CalendarOutlined,
	SnippetsOutlined,
	AppstoreOutlined,
} from "@ant-design/icons";
import { Col, Row } from "antd";
import SidebarItem from "./SidebarItem";

const itemsInProject = [
	{
		name: "Projekt",
		icon: <SnippetsOutlined />,
		link: "/team/:id",
		current: true,
	},
	{
		name: "Zadania",
		icon: <AppstoreOutlined />,
		link: "/team/:id/get-projects",
		current: false,
	},
	{
		name: "Członkowie",
		icon: <SmileOutlined />,
		link: "team/:id/get-members",
		current: false,
	},
];

const itemsInTeam = [
	{
		name: "Zespół",
		icon: <SafetyCertificateOutlined />,
		link: "/team/:id",
		current: true,
	},
	{
		name: "Projekty",
		icon: <FundProjectionScreenOutlined />,
		link: "/team/:id/get-projects",
		current: false,
		underItems: itemsInProject,
	},
	{
		name: "Członkowie",
		icon: <SmileOutlined />,
		link: "team/:id/get-members",
		current: false,
	},
	{
		name: "Kalendarz",
		icon: <CalendarOutlined />,
		link: "/team/:id/get-calendar",
		current: false,
	},
];

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
		underItems: itemsInTeam,
	},
	{
		name: "Profil",
		link: "/profile/:userId",
		icon: <UserOutlined />,
		current: false,
	},
];

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
			underItems: itemsInTeam,
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
				className="bg-white shadow-lg h-full rounded-r-lg"
				style={{
					transition: "opacity 0.5s ease-out",
					opacity: 1,
				}}
			>
				{items.map((item, index) => (
					<SidebarItem key={index} {...item} />
				))}
			</div>
		)
	);
}

export default Sidebar;
