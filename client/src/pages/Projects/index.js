import React, { useEffect, useState } from "react";
import { Form, Input, Button, message, Table, Col, Row } from "antd";
import { Link, useNavigate } from "react-router-dom";
import Divider from "../../components/Divider";
import teamService from "../../services/team";
import userService from "../../services/user";
import { useSelector, useDispatch } from "react-redux";
import { SetLoading, SetButtonLoading } from "../../redux/loadersSlice";
import { getAntdFormInputRules } from "../../utils/helpers";
import { getSimpleDateFormat } from "../../utils/helpers";
import { SetNotifications, SetUser } from "../../redux/usersSlice";
import { IoTrashBin } from "react-icons/io5";
import ProjectForm from "./ProjectForm";
import SingleCard from "../../components/SingleCard";
import { FaPencilAlt } from "react-icons/fa";
import { Navigate } from "react-router-dom";
import StatsCard from "../../components/StatsCard";

// PAMIĘTAJ DEBILU - JEŻELI REQUEST CI NIE DZIAŁA, TO PROBLEM NA 99% JEST W BACKENDZIE - SPRAWDZAJ LOGI W KONSOLI VSCODE A NIE WEBOWEJ JEŚLI CHODZI O BACKEND, SPRAWDZAJ CZY W REQUESCIE SIĘ ZNAJDUJĄ RZECZY KTÓRE SĄ OCZEKIWANE W KONTROLERZE ITP

function Projects() {
	const { user } = useSelector((state) => state.users);
	const [projects, setProjects] = useState([]);
	const [users, setUsers] = useState([]);
	const [selectedProject, setSelectedProject] = useState(null);
	const [show, setShow] = useState(false);
	const dispatch = useDispatch();
	const navigate = useNavigate();

	const fetchUsers = async () => {
		try {
			// Add loading state handling if needed
			dispatch(SetLoading(true));
			const response = await userService.getAllUsers(); // Adjust with your actual API call
			if (response.success) {
				setUsers(response.data);
			} else {
				throw new Error(response.error);
			}
			dispatch(SetLoading(false));
		} catch (error) {
			dispatch(SetLoading(false));
			message.error(error.message);
		}
	};

	// const fetchTeams = async () => {
	// 	try {
	// 		dispatch(SetLoading(true));
	// 		console.log(`Jestem w fetchu`);
	// 		const response = await teamService.getAllTeams(); // Replace with your actual API endpoint
	// 		console.log("PO");
	// 		if (response.success) {
	// 			console.log(`Oto zespoły ${response.data}`);
	// 			setTeams(response.data);
	// 		} else {
	// 			throw new Error(response.error);
	// 		}
	// 		dispatch(SetLoading(false));
	// 	} catch (error) {
	// 		dispatch(SetLoading(false));
	// 		message.error(error.message);
	// 	}
	// };

	// const onDelete = async (id) => {
	// 	try {
	// 		dispatch(SetLoading(true));
	// 		const response = await teamService.deleteTeam(id);
	// 		if (response.success) {
	// 			message.success(response.message);
	// 			fetchTeams();
	// 		} else {
	// 			throw new Error(response.error);
	// 		}
	// 		dispatch(SetLoading(false));
	// 	} catch (error) {
	// 		dispatch(SetLoading(false));
	// 		message.error(error.message);
	// 	}
	// };

	const statsData = [
		{ title: "Projekty", value: 25 },
		{ title: "Leaderzy", value: 12 },
		{ title: "Pracownicy", value: 87 },
	];

	useEffect(() => {
		// fetchTeams();
		// fetchUsers();
	}, []);

	return (
		<>
			<Row gutter={24} className="w-full container mx-auto p-6">
				<Col span={16}>
					<div className="pr-3 pb-9">
						<StatsCard stats={statsData} />
					</div>
					{projects.map(([project], index) => (
						<div className="pr-3 pb-3">
							<SingleCard key={index} item={project} />
						</div>
					))}
				</Col>
				{user.role === "ADMIN" && (
					<Col span={8}>
						<ProjectForm users={users} />
					</Col>
				)}
			</Row>
		</>
		// <div>
		// 	{user.role === "ADMIN" && (
		// 		<div className="flex justify-end">
		// 			<Button
		// 				type="default"
		// 				onClick={() => {
		// 					setSelectedTeam(null);
		// 					setShow(true);
		// 				}}
		// 			>
		// 				Utwórz zespół
		// 			</Button>
		// 		</div>
		// 	)}
		// 	<Table columns={columns} data={teams} onRow={onRowClick} />
		// 	{show && (
		// 		<TeamForm
		// 			show={show}
		// 			setShow={setShow}
		// 			reloadData={fetchTeams}
		// 			team={selectedTeam}
		// 			users={users}
		// 		/>
		// 	)}
		// </div>
	);
}

export default Projects;
