import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

const itemsWhenInTeams = [
	{
		name: "Wszystkie zespoły",
		link: "/teams",
		current: true,
	},
	{
		name: "Moje zespoły",
		link: "/teams",
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
		link: "/team/:teamId",
		current: true,
	},
	{
		name: "Projekty",
		link: "/team/:teamId/projects",
		current: false,
	},
	{
		name: "Członkowie",
		link: "/team/:teamId/members",
		current: false,
	},
	{
		name: "Kalendarz",
		link: "/team/:teamId/calendar",
		current: false,
	},
];

const itemsWhenInProject = [
	{
		name: "Projekt",
		link: "/team/:teamId/project/:projectId",
		current: true,
	},
	{
		name: "Zadania",
		link: "/team/:teamId/project/:projectId/tasks",
		current: false,
	},
	{
		name: "Członkowie",
		link: "/team/:teamId/project/:projectId/members",
		current: false,
	},
];

function SubHeader({ user }) {
	const navigate = useNavigate();
	console.log("Użytkownik: ", user);

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
	const visibleItems = itemsWhenInTeams.filter(shouldShowItem);

	return (
		<div className="py-6 shadow-md" style={{ backgroundColor: "#138585" }}>
			<div className="flex justify-center space-x-10">
				{visibleItems.map((item, index) => (
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
