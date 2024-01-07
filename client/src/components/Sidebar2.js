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
		name: "Powiadomienia",
		icon: <BellTwoTone />,
		link: "#",
		notifications: 5,
		current: false,
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
	// {
	// 	name: "Kluczowe cechy",
	// 	link: "/",
	// 	current: false,
	// 	displayForGuest: true,
	// 	displayForUser: true,
	// 	sectionId: "main",
	// },
	// {
	// 	name: "Kontakt",
	// 	link: "/",
	// 	current: false,
	// 	displayForGuest: true,
	// 	displayForUser: true,
	// 	sectionId: "contact",
	// },
	// {
	// 	name: "Utwórz konto",
	// 	link: "/register",
	// 	current: false,
	// 	displayForGuest: true,
	// 	displayForUser: false,
	// },
	// {
	// 	name: "Zaloguj się",
	// 	link: "/login",
	// 	current: false,
	// 	displayForGuest: true,
	// 	displayForUser: false,
	// },
];

function Sidebar({ sidebarVisible }) {
	return (
		sidebarVisible && (
			<Col span={6}>
				<div>
					<div className="h-full bg-white shadow-md">
						{items.map((item, index) => (
							<SidebarItem key={index} {...item} />
						))}
					</div>
				</div>
			</Col>
		)
	);
}

export default Sidebar;
