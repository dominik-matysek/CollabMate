import React, { useEffect, useState } from "react";
import { Form, Input, Button, message, Table, Modal } from "antd";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { SetLoading } from "../../../redux/loadersSlice";
import { getSimpleDateFormat } from "../../../utils/helpers";
import { SetNotifications, SetUser } from "../../../redux/usersSlice";
import { IoTrashBin } from "react-icons/io5";
import { UserOutlined } from "@ant-design/icons";
import AddUserForm from "./AddUserForm";
import projectService from "../../../services/project";

function Project() {
	const { projectId } = useParams();
	const [project, setProject] = useState(null);
	const dispatch = useDispatch();
	const { user } = useSelector((state) => state.users);

	const [isModalVisible, setIsModalVisible] = useState(false);
	const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);

	const navigate = useNavigate();

	const fetchProjectData = async () => {
		try {
			dispatch(SetLoading(true));
			const response = await projectService.getProjectById(projectId);
			dispatch(SetLoading(false));
			if (response.success) {
				setProject(response.data);
				console.log("Projekt:", project);
			} else {
				throw new Error(response.message);
			}
		} catch (error) {
			dispatch(SetLoading(false));
			message.error(error.message);
		}
	};

	const reloadData = async () => {
		await fetchProjectData();
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

	const onDelete = async (id) => {
		try {
			dispatch(SetLoading(true));
			console.log("w onDelete, oto id:", id);
			const response = await projectService.removeMemberFromProject(
				projectId,
				id
			);
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

	const getRandomProjectMember = () => {
		if (project && project.members && project.members.length > 0) {
			const randomIndex = Math.floor(Math.random() * project.members.length);
			console.log("Członek projektu random: ", project.members[randomIndex]);
			return project.members[randomIndex];
		}
	};

	const currentMember = getRandomProjectMember();

	// const isTeamIdInUserTeams = user.team;

	console.log("Random lider: ", currentMember);

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

	return (
		project && (
			<div className="container mx-auto my-5 p-5">
				{/* {isTeamIdInUserTeams && <Sidebar />}  */}
				{/* Team Name and Creation Date */}
				<div className="flex justify-between items-center mb-6">
					<div>
						<h1 className="text-3xl font-bold text-gray-900 mb-3">
							{project.name}
						</h1>
						{user.role === "TEAM LEADER" && (
							<Button type="primary" danger onClick={showDeleteTeamModal}>
								Usuń projekt
							</Button>
						)}
					</div>
					<p className="text-gray-600">
						Data utworzenia: {getSimpleDateFormat(project.createdAt)}
					</p>
					{user.role === "TEAM LEADER" && (
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
						projectId={projectId}
						isVisible={isModalVisible}
						onClose={closeAddUserModal}
						reloadData={reloadData}
					/>
				</div>
			</div>
		)
	);
}

export default Project;
