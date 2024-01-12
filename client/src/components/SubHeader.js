import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

const itemsWhenInTeams = [
	{
		name: "Wszystkie zespoły",
		link: "/teams",
	},
	{
		name: "Mój zespoły",
		link: "/teams/:teamId", // to by mogło wyglądać tak, że w zakładce wszystkie zespoły pojawiają się wszystkie zespoły jakie istnieją w systemie, a w zakładce mój zespół pojawia się tylko zespół jeden do którego dany user zalogowany należy - jest card w postaci takiej jak pojedynczy zespół ma w zakładce wszystkie zespoły
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
		link: "/teams/:teamId/calendar",
	},
];

const itemsWhenInProject = [
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
		name: "Zadanie",
		link: "/tasks/:taskId",
	},
];

function SubHeader({ user }) {
	const location = useLocation();
	const navigate = useNavigate();
	const [currentItem, setCurrentItem] = useState("Wszystkie zespoły"); // Default current item

	const pathSegments = location.pathname.split("/").filter((seg) => seg);

	// Function to replace params in the link with actual IDs
	const getResolvedLink = (link) => {
		return link
			.replace(":teamId", user.team?._id)
			.replace(":projectId", pathSegments[1])
			.replace(":taskId", pathSegments[1]);
	};

	const shouldShowItem = (item) => {
		// If forRole is not defined, everyone can see it
		if (!item.forRole) {
			return true;
		}

		// If forRole is an array, check if the user's role is included in the array
		if (Array.isArray(item.forRole)) {
			return item.forRole.includes(user.role);
		}

		// If forRole is a string, check if it matches the user's role
		return item.forRole === user.role;
	};

	// Function to determine navigation items based on the current URL
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

	// Function to check if the item is the current item
	const isCurrentItem = (itemName) => {
		return currentItem === itemName;
	};

	return (
		<div className="py-6 shadow-md" style={{ backgroundColor: "#138585" }}>
			<div className="flex justify-center space-x-10">
				{getNavigationItems().map((item, index) => (
					<span
						key={index}
						className={`cursor-pointer text-white ${
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
