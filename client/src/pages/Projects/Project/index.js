import React, { useEffect, useState } from "react";
import { Input, Button, message, Table, Modal } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { SetLoading, SetButtonLoading } from "../../../redux/loadersSlice";
import { getSimpleDateFormat } from "../../../utils/helpers";
import { IoTrashBin } from "react-icons/io5";
import { UserOutlined } from "@ant-design/icons";
import AddUserForm from "./AddUserForm";
import projectService from "../../../services/project";
import notificationService from "../../../services/notification";

function Project() {
	const { projectId } = useParams();
	const [project, setProject] = useState(null);
	const dispatch = useDispatch();
	const { user } = useSelector((state) => state.users);

	const [editMode, setEditMode] = useState(false);
	const [description, setDescription] = useState(null);

	const [status, setStatus] = useState(null);
	const [initialDescription, setInitialDescription] = useState(null);
	const [isButtonDisabled, setIsButtonDisabled] = useState(true);

	const [isModalVisible, setIsModalVisible] = useState(false);
	const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);

	const teamId = project ? project.team : null;

	const isSameTeam = user.team._id === teamId;

	const navigate = useNavigate();

	const fetchProjectData = async () => {
		try {
			dispatch(SetLoading(true));
			const response = await projectService.getProjectById(projectId);
			dispatch(SetLoading(false));
			if (response.success) {
				setProject(response.data);
				setStatus(response.data.status);
				setDescription(response.data.description);
				setInitialDescription(description);
			} else {
				throw new Error(response.message);
			}
		} catch (error) {
			dispatch(SetLoading(false));
			message.error(error.message);
		}
	};

	const cycleStatus = () => {
		const nextStatus = {
			active: "completed",
			completed: "archived",
			archived: "active",
		};
		return nextStatus[status];
	};

	const handleStatusChange = async () => {
		if (user.role === "TEAM LEADER") {
			try {
				dispatch(SetButtonLoading(true));
				const response = await projectService.changeProjectStatus(projectId);
				if (response.success) {
					const newStatus = cycleStatus();
					setStatus(newStatus);
				} else {
					throw new Error(response.message);
				}
				dispatch(SetButtonLoading(false));
			} catch (error) {
				dispatch(SetButtonLoading(false));
				message.error(error.message);
			}
		}
	};

	const handleDescriptionChange = (e) => {
		setDescription(e.target.value);
		setIsButtonDisabled(
			e.target.value === initialDescription ||
				e.target.value.length < 5 ||
				e.target.value.length > 250
		);
	};

	const saveDescription = async () => {
		if (user.role === "TEAM LEADER") {
			try {
				dispatch(SetLoading(true));
				const response = await projectService.changeProjectDescription(
					projectId,
					description
				);
				if (response.success) {
					message.success(response.message);
					setEditMode(false);
				} else {
					throw new Error(response.message);
				}
				dispatch(SetLoading(false));
			} catch (error) {
				dispatch(SetLoading(false));
				message.error(error.message);
			}
		}
	};

	const reloadData = async () => {
		await fetchProjectData();
	};

	const showDeleteProjectModal = () => {
		setIsDeleteModalVisible(true);
	};

	const closeDeleteProjectModal = () => {
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
	}, [projectId]);

	const onRowClick = (record) => {
		return {
			onClick: () => {
				navigate(`/profile/${record._id}`);
			},
		};
	};

	const confirmDeleteProject = async () => {
		try {
			dispatch(SetLoading(true));
			const response = await projectService.deleteProject(projectId);
			if (response.success) {
				message.success(response.message);
				navigate(`/teams/${teamId}/projects`);

				const notificationPayload = {
					users: project.members,
					title: "Usunięto projekt",
					description: `Usunięto projekt którego byłeś członkiem z twojego zespołu.`,
					link: `/projects`,
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

			const response = await projectService.removeMemberFromProject(
				projectId,
				id
			);
			if (response.success) {
				message.success(response.message);
				reloadData();
				const notificationPayload = {
					users: id,
					title: "Usunięto z projektu",
					description: `Zostałeś usunięty z projektu w swoim zespole.`,
					link: `/projects`,
				};
				await notificationService.createNotification(notificationPayload);
			} else {
				message.error(response.message);
				throw new Error(response.error);
			}
			dispatch(SetLoading(false));
		} catch (error) {
			dispatch(SetLoading(false));
		}
	};

	const getRandomProjectMember = () => {
		if (project && project.members && project.members.length > 0) {
			const randomIndex = Math.floor(Math.random() * project.members.length);
			return project.members[randomIndex];
		}
	};

	let currentMember = getRandomProjectMember();

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

	if (user.role === "TEAM LEADER") {
		columns = [
			...columns,
			{
				title: "Akcja",
				dataIndex: "action",
				render: (text, record) => {
					return (
						<div
							className="flex justify-center"
							onClick={(e) => e.stopPropagation()}
						>
							<IoTrashBin onClick={() => onDelete(record._id)} />
						</div>
					);
				},
			},
		];
	}

	return isSameTeam ? (
		project && (
			<div className="container mx-auto my-5 p-5">
				<div className="flex justify-between items-center mb-6">
					<div>
						<h1 className="text-3xl font-bold text-gray-900 mb-3">
							{project.name}
						</h1>
						{user.role === "TEAM LEADER" && (
							<Button type="primary" danger onClick={showDeleteProjectModal}>
								Usuń projekt
							</Button>
						)}
					</div>
					{isDeleteModalVisible && (
						<Modal
							title="Potwierdź operację"
							open={isDeleteModalVisible}
							onOk={confirmDeleteProject}
							onCancel={closeDeleteProjectModal}
							okText="Tak"
							cancelText="Anuluj"
						>
							<p>Czy na pewno chcesz usunąć ten projekt?</p>
							<p>
								Wszystkie składowe - zadania, pliki, komentarze - również
								zostaną usunięte
							</p>
						</Modal>
					)}

					<div>
						<h2 className="text-2xl font-semibold text-gray-800 mb-3">
							Status projektu
						</h2>

						<Button
							type="primary"
							onClick={handleStatusChange}
							className={` ${
								status === "active"
									? "bg-green-500"
									: status === "completed"
									? "bg-blue-500"
									: "bg-gray-500"
							}`}
						>
							{status === "active"
								? "Aktywny"
								: status === "completed"
								? "Zakończony"
								: "Zarchiwizowany"}
						</Button>
					</div>
					<p className="text-gray-600">
						Data utworzenia: {getSimpleDateFormat(project.createdAt)}
					</p>
				</div>

				<div className="md:flex no-wrap md:-mx-2 ">
					{currentMember && (
						<div className="w-full md:w-3/12 md:mx-2 ">
							<div className="bg-white p-3 border-t-4 border-green-400 rounded-md">
								<div className="image overflow-hidden">
									<img
										className="h-auto w-full mx-auto"
										src={currentMember.profilePic}
										alt="Zdjęcie profilowe"
									/>
								</div>
								<h1 className="text-gray-900 font-bold text-xl leading-8 my-1">
									{currentMember.firstName} {currentMember.lastName}
								</h1>
								<h3 className="text-gray-600 font-lg text-semibold leading-6">
									Pracownik
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
											{getSimpleDateFormat(currentMember.createdAt)}
										</span>
									</li>
								</ul>
							</div>
						</div>
					)}

					<div className="w-full md:w-9/12 mx-2 ">
						<div
							className="mb-6 bg-indigo-100 p-4 rounded-md shadow-md"
							style={{ minHeight: "150px" }}
						>
							<div className="flex justify-between items-center">
								<h2 className="text-xl font-semibold text-gray-800">
									Opis projektu
								</h2>
								{user.role === "TEAM LEADER" && !editMode && (
									<Button type="default" onClick={() => setEditMode(true)}>
										Edytuj
									</Button>
								)}
							</div>
							{editMode ? (
								<div className="mt-2">
									<Input.TextArea
										value={description}
										onChange={handleDescriptionChange}
										rows={4}
										autoFocus
										showCount
										minLength={5}
										maxLength={250}
									/>
									<div className="flex justify-end mt-6">
										<Button
											type="default"
											onClick={() => {
												setEditMode(false);
											}}
											className="mr-2"
										>
											Anuluj
										</Button>
										<Button
											type="primary"
											onClick={saveDescription}
											disabled={isButtonDisabled}
										>
											Zapisz
										</Button>
									</div>
								</div>
							) : (
								<p
									className="text-gray-600 mt-2 overflow-auto"
									style={{ maxHeight: "100px" }}
								>
									{description}
								</p>
							)}
						</div>

						<div className="bg-white p-3 shadow-sm rounded-md">
							<div className="flex items-center justify-between font-semibold text-gray-900 leading-8">
								<div className="flex items-center space-x-2">
									<span>
										<UserOutlined />
									</span>
									<span className="tracking-wide">Lista członków</span>
								</div>

								{user.role === "TEAM LEADER" && (
									<div>
										<Button type="primary" onClick={showAddUserModal}>
											Dodaj pracownika
										</Button>
									</div>
								)}
							</div>
							{project.members && (
								<Table
									dataSource={project.members}
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
						project={project}
						isVisible={isModalVisible}
						onClose={closeAddUserModal}
						reloadData={reloadData}
					/>
				</div>
			</div>
		)
	) : (
		<div className="flex items-center justify-center h-screen">
			<div>
				<h1
					className="text-4xl font-bold text-center"
					style={{ color: "#138585" }}
				>
					403 - Forbidden
				</h1>
				<p className="text-2xl text-center">
					Niestety, nie posiadasz dostępu do tej zawartości
				</p>
			</div>
		</div>
	);
}

export default Project;
