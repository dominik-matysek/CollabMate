import React, { useEffect, useState } from "react";
import { Form, Input, Button, message, Table, Modal } from "antd";
import { Link, useNavigate, useParams } from "react-router-dom";
import teamService from "../../../services/team";
import { useSelector, useDispatch } from "react-redux";
import { SetLoading } from "../../../redux/loadersSlice";
import { getSimpleDateFormat } from "../../../utils/helpers";
import { SetNotifications, SetUser } from "../../../redux/usersSlice";
import { IoTrashBin } from "react-icons/io5";
import Sidebar from "../../../components/Sidebar";
import { UserOutlined } from "@ant-design/icons";
import AddUserForm from "./AddUserForm";

function Team() {
	const { teamId } = useParams();
	const [team, setTeam] = useState(null);
	const dispatch = useDispatch();
	const { user } = useSelector((state) => state.users);

	const [isModalVisible, setIsModalVisible] = useState(false);
	const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);

	const navigate = useNavigate();

	const fetchTeamData = async () => {
		try {
			dispatch(SetLoading(true));
			const response = await teamService.getTeamById(teamId);
			dispatch(SetLoading(false));
			if (response.success) {
				setTeam(response.data);
				console.log("Zespół:", team);
			} else {
				throw new Error(response.message);
			}
		} catch (error) {
			dispatch(SetLoading(false));
			message.error(error.message);
		}
	};

	const reloadData = async () => {
		await fetchTeamData();
	};

	const showDeleteTeamModal = () => {
		setIsDeleteModalVisible(true);
	};

	const closeDeleteTeamModal = () => {
		setIsModalVisible(false);
	};

	const showAddUserModal = () => {
		setIsModalVisible(true);
	};

	const closeAddUserModal = () => {
		setIsModalVisible(false);
		reloadData();
	};

	useEffect(() => {
		reloadData();
	}, [teamId]);

	const onRowClick = (record) => {
		return {
			onClick: () => {
				navigate(`/profile/${record._id}`);
			},
		};
	};

	const onDelete = async (id) => {
		try {
			dispatch(SetLoading(true));
			console.log("w onDelete, oto id:", id);
			const response = await teamService.removeUserFromTeam(teamId, id);
			if (response.success) {
				message.success(response.message);
				reloadData();
			} else {
				message.error(response.message);
				throw new Error(response.error);
			}
			dispatch(SetLoading(false));
		} catch (error) {
			dispatch(SetLoading(false));
		}
	};

	const getRandomTeamLeader = () => {
		if (team && team.teamLeaders && team.teamLeaders.length > 0) {
			const randomIndex = Math.floor(Math.random() * team.teamLeaders.length);
			console.log("Team leader random: ", team.teamLeaders[randomIndex]);
			return team.teamLeaders[randomIndex];
		}
	};

	const currentTeamLeader = getRandomTeamLeader();

	// const isTeamIdInUserTeams = user.team;

	console.log("Random lider: ", currentTeamLeader);

	let columns = [
		// Tu by mogło być jeszcze małe zdjecie profilowe kwadratowe albo okrągłe, jak juz ogarniesz zdjecia
		{
			title: "Imię",
			dataIndex: "firstName",
		},
		{
			title: "Nazwisko",
			dataIndex: "lastName",
		},
		{
			title: "Data dołączenia",
			dataIndex: "createdAt",
			render: (text) => getSimpleDateFormat(text),
		},
	];

	if (user.role === "ADMIN") {
		columns = [
			...columns,
			{
				title: "Akcja",
				dataIndex: "action",
				render: (text, record) => {
					// Check if the user is a team leader
					const isTeamLeader = team.teamLeaders.some(
						(leader) => leader._id === record._id
					);
					// Check if there's more than one team leader
					const multipleTeamLeaders = team.teamLeaders.length > 1;

					return (
						<div
							className="flex justify-center"
							onClick={(e) => e.stopPropagation()}
						>
							{user._id !== record._id &&
								(!isTeamLeader || multipleTeamLeaders) && (
									<IoTrashBin onClick={() => onDelete(record._id)} />
								)}
						</div>
					);
				},
			},
		];
	}

	return (
		team && (
			<div className="container mx-auto my-5 p-5">
				{/* {isTeamIdInUserTeams && <Sidebar />}  */}
				{/* Team Name and Creation Date */}
				<div className="flex justify-between items-center mb-6">
					<div>
						<h1 className="text-3xl font-bold text-gray-900 mb-3">
							{team.name}
						</h1>
						{user.role === "ADMIN" && (
							<Button type="primary" danger onClick={showDeleteTeamModal}>
								Usuń zespół
							</Button>
						)}
					</div>
					<p className="text-gray-600">
						Data utworzenia: {getSimpleDateFormat(team.createdAt)}
					</p>
					{user.role === "ADMIN" && (
						<Button type="primary" onClick={showAddUserModal}>
							Dodaj pracownika
						</Button>
					)}
				</div>
				<div className="md:flex no-wrap md:-mx-2 ">
					<div className="w-full md:w-3/12 md:mx-2">
						<div className="bg-white p-3 border-t-4 border-green-400">
							<div className="image overflow-hidden">
								<img
									className="h-auto w-full mx-auto"
									src={currentTeamLeader.profilePic}
									alt="Zdjęcie profilowe"
								/>
							</div>
							<h1 className="text-gray-900 font-bold text-xl leading-8 my-1">
								{currentTeamLeader.firstName} {currentTeamLeader.lastName}
							</h1>
							<h3 className="text-gray-600 font-lg text-semibold leading-6">
								Team Lider
							</h3>

							<ul className="bg-gray-100 text-gray-600 hover:text-gray-700 hover:shadow py-2 px-3 mt-3 divide-y rounded shadow-sm">
								<li className="flex items-center py-3">
									<span>Status</span>
									<span className="ml-auto">
										<span className="bg-green-500 py-1 px-2 rounded text-white text-sm">
											Aktywny
										</span>
									</span>
								</li>
								<li className="flex items-center py-3">
									<span>Data dołączenia</span>
									<span className="ml-auto">
										{getSimpleDateFormat(currentTeamLeader.createdAt)}
									</span>
								</li>
							</ul>
						</div>
					</div>
					<div className="w-full md:w-9/12 mx-2 h-64">
						<div className="bg-white p-3 shadow-sm rounded-sm">
							<div className="flex items-center justify-between font-semibold text-gray-900 leading-8">
								<div className="flex items-center space-x-2">
									<span>
										<UserOutlined />
									</span>
									<span className="tracking-wide">Lista członków</span>
								</div>
							</div>
							{team.members && (
								<Table
									dataSource={team.members}
									columns={columns}
									className="mt-4 zebra-table"
									onRow={onRowClick}
									pagination={{ pageSize: 50 }}
									scroll={{ y: 200 }}
								/>
							)}
						</div>
						<div className="bg-white p-3 shadow-sm rounded-sm">
							<div className="flex items-center justify-between font-semibold text-gray-900 leading-8">
								<div className="flex items-center space-x-2">
									<span>
										<UserOutlined />
									</span>
									<span className="tracking-wide">Lista liderów</span>
								</div>
							</div>
							{team.teamLeaders && (
								<Table
									dataSource={team.teamLeaders}
									columns={columns}
									className="mt-4 zebra-table"
									onRow={onRowClick}
									pagination={{ pageSize: 50 }}
									scroll={{ y: 200 }}
								/>
							)}
						</div>
					</div>
					<AddUserForm
						teamId={teamId}
						isVisible={isModalVisible}
						onClose={closeAddUserModal}
						reloadData={reloadData}
					/>
				</div>
			</div>
		)
	);
}

export default Team;

// import React, { useEffect, useState } from "react";
// import { Form, Input, Button, message, Table } from "antd";
// import { Link, useNavigate, useParams } from "react-router-dom";
// import teamService from "../../../services/team";
// import { useSelector, useDispatch } from "react-redux";
// import { SetLoading } from "../../../redux/loadersSlice";
// import {
// 	getAntdFormInputRules,
// 	getSimpleDateFormat,
// } from "../../../utils/helpers";
// import { SetNotifications, SetUser } from "..//../../redux/usersSlice";
// import CustomTable from "../../../components/CustomTable";
// import { IoTrashBin } from "react-icons/io5";
// import Sidebar from "../../../components/Sidebar";

// function Team() {
// 	const { teamId } = useParams();
// 	const [team, setTeam] = useState(null);
// 	const dispatch = useDispatch();
// 	const { user } = useSelector((state) => state.users);

// 	const navigate = useNavigate();

// 	const fetchTeamData = async () => {
// 		try {
// 			dispatch(SetLoading(true));
// 			const response = await teamService.getTeamById(teamId);
// 			dispatch(SetLoading(false));
// 			if (response.success) {
// 				setTeam(response.data);
// 				console.log("Zespół:", team);
// 			} else {
// 				throw new Error(response.message);
// 			}
// 		} catch (error) {
// 			dispatch(SetLoading(false));
// 			message.error(error.message);
// 		}
// 	};

// 	useEffect(() => {
// 		fetchTeamData();
// 	}, [teamId]);

// 	const onRowClick = (record) => {
// 		return {
// 			onClick: () => {
// 				navigate(`/profile/${record._id}`);
// 			},
// 		};
// 	};

// 	const isTeamIdInUserTeams = user.teams.includes(teamId);

// 	const columns = [
// 		// Tu by mogło być jeszcze małe zdjecie profilowe kwadratowe albo okrągłe, jak juz ogarniesz zdjecia
// 		{
// 			title: "Imię",
// 			dataIndex: "firstName",
// 		},
// 		{
// 			title: "Nazwisko",
// 			dataIndex: "lastName",
// 		},
// 		{
// 			title: "Data dołączenia",
// 			dataIndex: "createdAt",
// 			render: (text) => getSimpleDateFormat(text),
// 		},
// 		{
// 			title: "Akcja",
// 			dataIndex: "action",
// 			render: (text, record) => {
// 				return (
// 					<div className="flex gap-4">
// 						{/* Niżej możesz wrzucić onClick={() => onDelete(record._id)}  jak sie zdecydujesz na usuwanie usera */}
// 						<IoTrashBin />
// 					</div>
// 				);
// 			},
// 		},
// 	];

// 	return (
// 		team && (
// 			<div className="container mx-auto my-5 p-5">
// 				{isTeamIdInUserTeams && <Sidebar />}
// 				{/* Team Name and Creation Date */}
// 				<div className="mb-6">
// 					<h1 className="text-3xl font-bold text-gray-900 mb-2">{team.name}</h1>
// 					<p className="text-gray-600">
// 						Data utworzenia: {getSimpleDateFormat(team.createdAt)}
// 					</p>
// 				</div>
// 				<div className="md:flex no-wrap md:-mx-2 ">
// 					<div className="w-full md:w-3/12 md:mx-2">
// 						<div className="bg-white p-3 border-t-4 border-green-400">
// 							<div className="image overflow-hidden">
// 								<img
// 									className="h-auto w-full mx-auto"
// 									src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
// 									alt=""
// 								/>
// 							</div>
// 							<h1 className="text-gray-900 font-bold text-xl leading-8 my-1">
// 								{team.teamLead.firstName} {team.teamLead.lastName}
// 							</h1>
// 							<h3 className="text-gray-600 font-lg text-semibold leading-6">
// 								Team Leader
// 							</h3>

// 							<ul className="bg-gray-100 text-gray-600 hover:text-gray-700 hover:shadow py-2 px-3 mt-3 divide-y rounded shadow-sm">
// 								<li className="flex items-center py-3">
// 									<span>Status</span>
// 									<span className="ml-auto">
// 										<span className="bg-green-500 py-1 px-2 rounded text-white text-sm">
// 											Aktywny
// 										</span>
// 									</span>
// 								</li>
// 								<li className="flex items-center py-3">
// 									<span>Data dołączenia</span>
// 									<span className="ml-auto">
// 										{getSimpleDateFormat(team.teamLead.createdAt)}
// 									</span>
// 								</li>
// 							</ul>
// 						</div>
// 					</div>
// 					<div className="w-full md:w-9/12 mx-2 h-64">
// 						<div className="bg-white p-3 shadow-sm rounded-sm">
// 							<div className="flex items-center justify-between font-semibold text-gray-900 leading-8">
// 								<div className="flex items-center space-x-2">
// 									<span>
// 										<svg
// 											className="h-5"
// 											xmlns="http://www.w3.org/2000/svg"
// 											fill="none"
// 											viewBox="0 0 24 24"
// 											stroke="currentColor"
// 										>
// 											<path
// 												strokeLinecap="round"
// 												strokeLinejoin="round"
// 												strokeWidth="2"
// 												d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
// 											/>
// 										</svg>
// 									</span>
// 									<span className="tracking-wide">Lista członków</span>
// 								</div>
// 								{user.role === "ADMIN" && <Button>Dodaj użytkownika</Button>}
// 							</div>
// 							{team.members && (
// 								<Table
// 									dataSource={team.members}
// 									columns={columns}
// 									onRow={onRowClick}
// 									className="mt-4"
// 								/>
// 							)}
// 						</div>
// 					</div>
// 				</div>
// 			</div>
// 		)
// 	);
// }

// export default Team;
