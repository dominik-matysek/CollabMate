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
import TeamForm from "./TeamForm";
import SingleCard from "../../components/SingleCard";
import { FaPencilAlt } from "react-icons/fa";
import { Navigate } from "react-router-dom";
import StatsCard from "../../components/StatsCard";

// PAMIĘTAJ DEBILU - JEŻELI REQUEST CI NIE DZIAŁA, TO PROBLEM NA 99% JEST W BACKENDZIE - SPRAWDZAJ LOGI W KONSOLI VSCODE A NIE WEBOWEJ JEŚLI CHODZI O BACKEND, SPRAWDZAJ CZY W REQUESCIE SIĘ ZNAJDUJĄ RZECZY KTÓRE SĄ OCZEKIWANE W KONTROLERZE ITP

function Teams() {
	const { user } = useSelector((state) => state.users);
	const [teams, setTeams] = useState([]);
	const [users, setUsers] = useState([]);
	const [selectedTeam, setSelectedTeam] = useState(null);
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

	const fetchTeams = async () => {
		try {
			dispatch(SetLoading(true));
			console.log(`Jestem w fetchu`);
			const response = await teamService.getAllTeams(); // Replace with your actual API endpoint
			console.log("PO");
			if (response.success) {
				console.log(`Oto zespoły ${response.data}`);
				setTeams(response.data);
			} else {
				throw new Error(response.error);
			}
			dispatch(SetLoading(false));
		} catch (error) {
			dispatch(SetLoading(false));
			message.error(error.message);
		}
	};

	const onDelete = async (id) => {
		try {
			dispatch(SetLoading(true));
			const response = await teamService.deleteTeam(id);
			if (response.success) {
				message.success(response.message);
				fetchTeams();
			} else {
				throw new Error(response.error);
			}
			dispatch(SetLoading(false));
		} catch (error) {
			dispatch(SetLoading(false));
			message.error(error.message);
		}
	};

	const statsData = [
		{ title: "Teams", value: 9 },
		{ title: "Leads", value: 12 },
		{ title: "Employees", value: 87 },
		{ title: "Admins", value: 25 },
	];

	useEffect(() => {
		fetchTeams();
		fetchUsers();
	}, []);

	// const columns = [
	// 	{
	// 		title: "Nazwa",
	// 		dataIndex: "name",
	// 	},
	// 	{
	// 		title: "Lider zespołu",
	// 		dataIndex: "teamLead",
	// 		render: (teamLead) => `${teamLead.firstName} ${teamLead.lastName}`,
	// 	},
	// 	{
	// 		title: "Liczba członków",
	// 		dataIndex: "members",
	// 		render: (members) => members.length,
	// 	},
	// 	{
	// 		title: "Data utworzenia",
	// 		dataIndex: "createdAt",
	// 		render: (text) => getSimpleDateFormat(text),
	// 	},
	// 	{
	// 		title: "Akcja",
	// 		dataIndex: "action",
	// 		render: (text, record) => {
	// 			return (
	// 				<div className="flex gap-4">
	// 					<IoTrashBin onClick={() => onDelete(record._id)} />
	// 					<FaPencilAlt
	// 						onClick={() => {
	// 							setSelectedTeam(record);
	// 							setShow(true);
	// 						}}
	// 					/>
	// 				</div>
	// 			);
	// 		},
	// 	},
	// ];

	return (
		<>
			<Row gutter={24} className="w-full container mx-auto p-6">
				<Col span={16}>
					<div className="pr-3 pb-9">
						<StatsCard stats={statsData} />
					</div>
					{teams.map((team, index) => (
						<div className="pr-3 pb-3">
							<SingleCard key={index} item={team} />
						</div>
					))}
				</Col>
				{user.role === "ADMIN" && (
					<Col span={8}>
						<TeamForm users={users} />
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

export default Teams;

// import React, { useEffect, useState } from "react";
// import { Form, Input, Button, message, Table } from "antd";
// import { Link, useNavigate } from "react-router-dom";
// import Divider from "../../components/Divider";
// import teamService from "../../services/team";
// import userService from "../../services/user";
// import { useSelector, useDispatch } from "react-redux";
// import { SetLoading, SetButtonLoading } from "../../redux/loadersSlice";
// import { getAntdFormInputRules } from "../../utils/helpers";
// import { getSimpleDateFormat } from "../../utils/helpers";
// import { SetNotifications, SetUser } from "../../redux/usersSlice";
// import { IoTrashBin } from "react-icons/io5";
// import TeamForm from "./TeamForm";
// import TeamCard from "../../components/TeamCard";
// import { FaPencilAlt } from "react-icons/fa";
// import { Navigate } from "react-router-dom";
// import CustomTable from "../../components/CustomTable";

// // PAMIĘTAJ DEBILU - JEŻELI REQUEST CI NIE DZIAŁA, TO PROBLEM NA 99% JEST W BACKENDZIE - SPRAWDZAJ LOGI W KONSOLI VSCODE A NIE WEBOWEJ JEŚLI CHODZI O BACKEND, SPRAWDZAJ CZY W REQUESCIE SIĘ ZNAJDUJĄ RZECZY KTÓRE SĄ OCZEKIWANE W KONTROLERZE ITP

// function Teams() {
// 	const { user } = useSelector((state) => state.users);
// 	const [teams, setTeams] = useState([]);
// 	const [users, setUsers] = useState([]);
// 	const [selectedTeam, setSelectedTeam] = useState(null);
// 	const [show, setShow] = useState(false);
// 	const dispatch = useDispatch();
// 	const navigate = useNavigate();

// 	const fetchUsers = async () => {
// 		try {
// 			// Add loading state handling if needed
// 			dispatch(SetLoading(true));
// 			const response = await userService.getAllUsers(); // Adjust with your actual API call
// 			if (response.success) {
// 				setUsers(response.data);
// 			} else {
// 				throw new Error(response.error);
// 			}
// 			dispatch(SetLoading(false));
// 		} catch (error) {
// 			dispatch(SetLoading(false));
// 			message.error(error.message);
// 		}
// 	};

// 	const fetchTeams = async () => {
// 		try {
// 			dispatch(SetLoading(true));
// 			console.log(`Jestem w fetchu`);
// 			const response = await teamService.getAllTeams(); // Replace with your actual API endpoint
// 			console.log("PO");
// 			if (response.success) {
// 				console.log(`Oto zespoły ${response.data}`);
// 				setTeams(response.data);
// 			} else {
// 				throw new Error(response.error);
// 			}
// 			dispatch(SetLoading(false));
// 		} catch (error) {
// 			dispatch(SetLoading(false));
// 			message.error(error.message);
// 		}
// 	};

// 	const onDelete = async (id) => {
// 		try {
// 			dispatch(SetLoading(true));
// 			const response = await teamService.deleteTeam(id);
// 			if (response.success) {
// 				message.success(response.message);
// 				fetchTeams();
// 			} else {
// 				throw new Error(response.error);
// 			}
// 			dispatch(SetLoading(false));
// 		} catch (error) {
// 			dispatch(SetLoading(false));
// 			message.error(error.message);
// 		}
// 	};

// 	const onRowClick = (record) => {
// 		return {
// 			onClick: () => {
// 				navigate(`/team/${record._id}`);
// 			},
// 		};
// 	};

// 	useEffect(() => {
// 		fetchTeams();
// 		fetchUsers();
// 	}, []);

// 	const columns = [
// 		{
// 			title: "Nazwa",
// 			dataIndex: "name",
// 		},
// 		{
// 			title: "Lider zespołu",
// 			dataIndex: "teamLead",
// 			render: (teamLead) => `${teamLead.firstName} ${teamLead.lastName}`,
// 		},
// 		{
// 			title: "Liczba członków",
// 			dataIndex: "members",
// 			render: (members) => members.length,
// 		},
// 		{
// 			title: "Data utworzenia",
// 			dataIndex: "createdAt",
// 			render: (text) => getSimpleDateFormat(text),
// 		},
// 		{
// 			title: "Akcja",
// 			dataIndex: "action",
// 			render: (text, record) => {
// 				return (
// 					<div className="flex gap-4">
// 						<IoTrashBin onClick={() => onDelete(record._id)} />
// 						<FaPencilAlt
// 							onClick={() => {
// 								setSelectedTeam(record);
// 								setShow(true);
// 							}}
// 						/>
// 					</div>
// 				);
// 			},
// 		},
// 	];

// 	return (
// 		<div>
// 			{user.role === "ADMIN" && (
// 				<div className="flex justify-end">
// 					<Button
// 						type="default"
// 						onClick={() => {
// 							setSelectedTeam(null);
// 							setShow(true);
// 						}}
// 					>
// 						Utwórz zespół
// 					</Button>
// 				</div>
// 			)}
// 			<Table columns={columns} data={teams} onRow={onRowClick} />
// 			{show && (
// 				<TeamForm
// 					show={show}
// 					setShow={setShow}
// 					reloadData={fetchTeams}
// 					team={selectedTeam}
// 					users={users}
// 				/>
// 			)}
// 		</div>
// 	);
// }

// export default Teams;
