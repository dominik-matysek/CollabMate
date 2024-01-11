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
		name: "Członkowie",
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
		link: "/teams/:teamId/projects/:projectId",
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
