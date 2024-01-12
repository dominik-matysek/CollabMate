import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

const itemsWhenInTeams = [
	{
		name: "Wszystkie zespoły",
		link: "/teams",
		current: true,
	},
	{
		name: "Mój zespoły",
		link: "/teams/:teamId", // to by mogło wyglądać tak, że w zakładce wszystkie zespoły pojawiają się wszystkie zespoły jakie istnieją w systemie, a w zakładce mój zespół pojawia się tylko zespół jeden do którego dany user zalogowany należy - jest card w postaci takiej jak pojedynczy zespół ma w zakładce wszystkie zespoły
		current: false,
		forRole: ["TEAM LEADER", "EMPLOYEE"],
	},
	{
		name: "Wszyscy użytkownicy",
		link: "/users",
		current: false,
		forRole: "ADMIN",
	},
];

const itemsWhenInTeam = [
	{
		name: "Zespół",
		link: "/teams/:teamId",
		current: true,
	},
	{
		name: "Projekty",
		link: "/teams/:teamId/projects",
		current: false,
	},
	{
		name: "Członkowie", // nie wiem jeszcze czy członków to sie opyla robić w ogóle
		link: "/teams/:teamId/get-members",
		current: false,
	},
	{
		name: "Kalendarz",
		link: "/teams/:teamId/calendar",
		current: false,
	},
];

const itemsWhenInProject = [
	{
		name: "Projekt",
		link: "/projects/:projectId",
		current: true,
	},
	{
		name: "Zadania",
		link: "/projects/:projectId/tasks",
		current: false,
	},
	{
		name: "Członkowie", // nie wiem jeszcze czy członków to sie opyla robić w ogóle
		link: "/team/:teamId/project/:projectId/members",
		current: false,
	},
];

const itemWhenInTask = [
	{
		name: "Zadanie",
		link: "/tasks/:id",
		current: true,
	},
];

function SubHeader({ user }) {
	const location = useLocation();
	const navigate = useNavigate();

	const pathSegments = location.pathname.split("/").filter((seg) => seg);

	// Function to determine navigation items based on the current URL
	const getNavigationItems = () => {
		const isAdmin = user.role === "ADMIN";

		const items = [];

		if (isAdmin) {
			items = itemsWhenInTeams;
		} else {
			if (pathSegments[0] === "teams" && pathSegments.length > 1) {
				const teamId = pathSegments[1];
				if (user.team && user.team._id === teamId) {
					items = itemsWhenInTeam;
				}
			} else if (pathSegments[0] === "projects" && pathSegments.length > 1) {
				const projectId = pathSegments[1];
				items = itemsWhenInProject;
			} else if (pathSegments[0] === "tasks" && pathSegments.length > 1) {
				const taskId = pathSegments[1];
				items = itemWhenInTask;
			} else {
				items = itemsWhenInTeams;
			}
		}

		return items;
	};

	const shouldShowItem = (item) => {
		if (!item.forRole) {
			return true;
		}
		if (Array.isArray(item.forRole)) {
			return item.forRole.includes(user.role);
		}
		return item.forRole === user.role;
	};

	// Filter items based on the user's role
	// const visibleItems = itemsWhenInTeams.filter(shouldShowItem);

	return (
		<div className="py-6 shadow-md" style={{ backgroundColor: "#138585" }}>
			<div className="flex justify-center space-x-10">
				{itemsWhenInTeams.map((item, index) => (
					<span
						className="cursor-pointer text-white"
						key={index}
						onClick={() => navigate(item.link)}
					>
						{item.name}
					</span>
				))}
			</div>
		</div>
	);
}

export default SubHeader;
