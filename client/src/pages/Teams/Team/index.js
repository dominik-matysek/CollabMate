import React, { useEffect, useState } from "react";
import { Button, message, Table, Modal } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import teamService from "../../../services/team";
import notificationService from "../../../services/notification";
import { useSelector, useDispatch } from "react-redux";
import { SetLoading } from "../../../redux/loadersSlice";
import { getSimpleDateFormat } from "../../../utils/helpers";
import { IoTrashBin } from "react-icons/io5";
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
		setIsDeleteModalVisible(false);
	};

	const showAddUserModal = () => {
		setIsModalVisible(true);
	};

	const closeAddUserModal = () => {
		setIsModalVisible(false);
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

	const confirmDeleteTeam = async () => {
		try {
			dispatch(SetLoading(true));
			const response = await teamService.deleteTeam(teamId);
			if (response.success) {
				message.success(response.message);
				navigate("/teams");

				const notificationPayload = {
					users: [...team.teamLeaders, ...team.members],
					title: "Usunięto zespół",
					description: `Twój zespół został usunięty przez administratora.`,
					link: "/teams",
				};
				await notificationService.createNotification(notificationPayload);
			} else {
				throw new Error(response.message);
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
			const response = await teamService.removeUserFromTeam(teamId, id);
			if (response.success) {
				message.success(response.message);
				reloadData();
				const notificationPayload = {
					users: team.teamLeaders,
					title: "Usunięto członka",
					description: `Z twojego zespołu usunięto jednego lub więcej członków: ${team.name}.`,
					link: `/teams/${team.id}`,
				};
				await notificationService.createNotification(notificationPayload);
				const notificationPayloadToRemoved = {
					users: id,
					title: "Usunięto cię z zespołu",
					description: `Zostałeś usunięty z zespołu: ${team.name}.`,
					link: `/teams`,
				};
				await notificationService.createNotification(
					notificationPayloadToRemoved
				);
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
			return team.teamLeaders[randomIndex];
		}
	};

	const currentTeamLeader = getRandomTeamLeader();

	let columns = [
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
					const isTeamLeader = team.teamLeaders.some(
						(leader) => leader._id === record._id
					);

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
					{isDeleteModalVisible && (
						<Modal
							title="Potwierdź operację"
							open={isDeleteModalVisible}
							onOk={confirmDeleteTeam}
							onCancel={closeDeleteTeamModal}
							okText="Tak"
							cancelText="Anuluj"
						>
							<p>Czy na pewno chcesz usunąć ten zespół?</p>
							<p>
								Wszystkie składowe - projekty, zadania, wydarzenia - również
								zostaną usunięte
							</p>
						</Modal>
					)}
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
								Lider zespołu
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
					<div className="w-full md:w-9/12 mx-2 ">
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
						team={team}
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
