import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const itemsWhenInTeams = [
	{
		name: "Wszystkie zespoły",
		link: "/teams",
	},
	{
		name: "Mój zespoły",
		link: "/teams/:teamId",
		forRole: ["TEAM LEADER", "EMPLOYEE"],
	},
	{
		name: "Wszyscy użytkownicy",
		link: "/users",
		forRole: "ADMIN",
	},
];

const itemsWhenInTeam = [
	{
		name: "Zespół",
		link: "/teams/:teamId",
	},
	{
		name: "Projekty",
		link: "/teams/:teamId/projects",
	},
	{
		name: "Kalendarz",
		link: "/teams/:teamId/events",
	},
];

const itemsWhenInProject = [
	{
		name: "Zespół",
		link: "/teams/:teamId",
	},
	{
		name: "Projekt",
		link: "/projects/:projectId",
	},
	{
		name: "Zadania",
		link: "/projects/:projectId/tasks",
	},
];

const itemWhenInTask = [
	{
		name: "Zespół",
		link: "/teams/:teamId",
	},
	{
		name: "Zadanie",
		link: "/tasks/:taskId",
	},
];

function SubHeader({ user }) {
	const location = useLocation();
	const navigate = useNavigate();
	const [currentItem, setCurrentItem] = useState("Wszystkie zespoły");

	const pathSegments = location.pathname.split("/").filter((seg) => seg);

	const getResolvedLink = (link) => {
		return link
			.replace(":teamId", user.team?._id)
			.replace(":projectId", pathSegments[1])
			.replace(":taskId", pathSegments[1]);
	};

	const shouldShowItem = (item) => {
		// Jeśli nie zdefiniowane, każdy ma podgląd
		if (!item.forRole) {
			return true;
		}

		// Sprawdzanie czy rola uzytkownika pasuje
		if (Array.isArray(item.forRole)) {
			return item.forRole.includes(user.role);
		}

		// Sprawdzanie stringa (admin)
		return item.forRole === user.role;
	};

	const getNavigationItems = () => {
		let items = [];

		if (user.role !== "ADMIN" && pathSegments.length > 1) {
			const isTeamPage = pathSegments[0] === "teams";
			const isProjectPage = pathSegments[0] === "projects";
			const isTaskPage = pathSegments[0] === "tasks";

			if (isTeamPage && user.team?._id === pathSegments[1]) {
				items = itemsWhenInTeam;
			} else if (isProjectPage) {
				items = itemsWhenInProject;
			} else if (isTaskPage) {
				items = itemWhenInTask;
			} else {
				items = itemsWhenInTeams;
			}
		} else {
			items = itemsWhenInTeams;
		}

		const visibleItems = items.filter(shouldShowItem);

		return visibleItems;
	};

	const handleItemClick = (itemName, link) => {
		setCurrentItem(itemName);
		navigate(getResolvedLink(link));
	};

	const isCurrentItem = (itemName) => {
		return currentItem === itemName;
	};

	return (
		<div className="py-6 shadow-md" style={{ backgroundColor: "#138585" }}>
			<div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-10 overflow-x-auto">
				{getNavigationItems().map((item, index) => (
					<span
						key={index}
						className={`cursor-pointer text-sm md:text-base text-white ${
							isCurrentItem(item.name) ? "bg-blue-500" : ""
						}`}
						onClick={() => handleItemClick(item.name, item.link)}
					>
						{item.name}
					</span>
				))}
			</div>
		</div>
	);
}

export default SubHeader;
