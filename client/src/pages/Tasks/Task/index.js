import React, { useEffect, useState } from "react";
import { Input, Button, message, Select, Row, Col, Modal } from "antd";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { SetLoading, SetButtonLoading } from "../../../redux/loadersSlice";
import { getSimpleDateFormat } from "../../../utils/helpers";
import { SetNotifications, SetUser } from "../../../redux/usersSlice";
import AddUserForm from "./AddUserForm";
import { getAntdFormInputRules } from "../../../utils/helpers";
import taskService from "../../../services/task";
import UserList from "../../../components/UserList";
import FileUpload from "../../../components/FileUpload";
import FileList from "../../../components/FileList";
import Comments from "../../../components/Comments";
import CommentInput from "../../../components/CommentInput";
import commentService from "../../../services/comment";
import notificationService from "../../../services/notification";

const { Option } = Select;

function Task() {
	const { taskId } = useParams();
	const [task, setTask] = useState(null);
	const dispatch = useDispatch();
	const { user } = useSelector((state) => state.users);

	const [editMode, setEditMode] = useState(false);
	const [description, setDescription] = useState(null);

	const [status, setStatus] = useState(null);
	const [priority, setPriority] = useState(null);
	const [initialDescription, setInitialDescription] = useState(null);
	const [isButtonDisabled, setIsButtonDisabled] = useState(true);

	const [allowedTransitions, setAllowedTransitions] = useState([]);

	const [isModalVisible, setIsModalVisible] = useState(false);
	const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);

	const [comments, setComments] = useState([]);

	const navigate = useNavigate();

	const projectId = task ? task.project : null;

	const fetchTaskData = async () => {
		try {
			dispatch(SetLoading(true));
			const response = await taskService.getTaskById(taskId);
			dispatch(SetLoading(false));
			if (response.success) {
				setTask(response.data);
				setStatus(response.data.status);
				setPriority(response.data.priority);
				setDescription(response.data.description);
				setInitialDescription(description);
				setAllowedTransitions(response.allowedTransitions || []);
				console.log("USERID: ", user._id);
				console.log("USERROLE: ", user.role);
			} else {
				throw new Error(response.message);
			}
		} catch (error) {
			dispatch(SetLoading(false));
			message.error(error.message);
		}
	};

	const fetchAllComments = async () => {
		try {
			dispatch(SetLoading(true));
			const response = await commentService.getComments(taskId);
			dispatch(SetLoading(false));
			if (response.success) {
				setComments(response.comments);
				console.log("Komentarze", response.comments);
			} else {
				throw new Error(response.message);
			}
		} catch (error) {
			dispatch(SetLoading(false));
			message.error(error.message);
		}
	};

	const cyclePriority = () => {
		const nextPriority = {
			low: "medium",
			medium: "high",
			high: "low",
		};
		return nextPriority[priority];
	};

	const handlePriorityChange = async () => {
		if (user.role === "TEAM LEADER" || user._id === task.createdBy) {
			try {
				dispatch(SetButtonLoading(true));
				const response = await taskService.changeTaskPriority(taskId);
				if (response.success) {
					const newPriority = cyclePriority();
					setPriority(newPriority);
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
		const newDescription = e.target.value;
		setDescription(newDescription);
		setIsButtonDisabled(
			newDescription === initialDescription ||
				newDescription.length < 5 ||
				newDescription.length > 250
		);
	};

	const handleStatusChange = async (newStatus) => {
		if (user.role === "TEAM LEADER" || user._id === task.createdBy) {
			try {
				dispatch(SetButtonLoading(true));
				const response = await taskService.changeTaskStatus(taskId, newStatus);
				if (response.success) {
					setStatus(newStatus);
					message.success("Task status updated successfully");
					reloadData();
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

	const saveDescription = async () => {
		if (user.role === "TEAM LEADER" || (task && user._id === task.createdBy)) {
			try {
				dispatch(SetLoading(true));
				const response = await taskService.changeTaskDescription(
					taskId,
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

	const translateStatus = (status) => {
		const statusTranslations = {
			pending: "Oczekujący",
			inProgress: "W trakcie",
			completed: "Zakończony",
			approved: "Zaakceptowany",
			cancelled: "Anulowany",
			overdue: "Po terminie",
		};

		return statusTranslations[status] || status;
	};

	const handleFileUpload = async (selectedFiles) => {
		const formData = new FormData();
		selectedFiles.forEach((file) => {
			formData.append("file", file);
		});

		try {
			dispatch(SetLoading(true));
			const response = await taskService.uploadAttachments(taskId, formData);
			dispatch(SetLoading(false));
			if (response.success) {
				message.success("Files uploaded successfully");
				reloadData(); // Reload task data to update the list of attachments

				const notificationPayload = {
					users: task.members, // Array of user IDs
					title: "Dodanie pliku",
					description: `Dodano plik do zadania którego jesteś członkiem.`,
					link: `/projects/${task.project}/tasks/${taskId}`, // Adjust link to point to the team page or relevant resource
				};
				await notificationService.createNotification(notificationPayload);
			} else {
				throw new Error(response.message);
			}
		} catch (error) {
			dispatch(SetLoading(false));
			message.error(error.message);
		}
	};

	const removeFile = async (id) => {
		try {
			dispatch(SetLoading(true));
			console.log("w onDelete, oto id:", id);
			const response = await taskService.removeAttachment(taskId, id);
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

	const removeMember = async (id) => {
		try {
			dispatch(SetLoading(true));
			console.log("w onDelete, oto id:", id);
			const response = await taskService.removeMemberFromTask(taskId, id);
			if (response.success) {
				message.success(response.message);
				reloadData();
				const notificationPayload = {
					users: id, // Array of user IDs
					title: "Usunięcie z zadania",
					description: `Usunięto Cię z zadania którego byłeś członkiem.`,
					link: `/projects/${task.project}/tasks`, // Adjust link to point to the team page or relevant resource
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

	const handleCommentSubmit = async (commentContent) => {
		try {
			dispatch(SetLoading(true));
			const response = await commentService.createComment(
				taskId,
				commentContent
			);
			if (response.success) {
				message.success("Comment added successfully");
				await reloadData(); // Refresh the comments list

				const notificationPayload = {
					users: task.members, // Array of user IDs
					title: "Dodano komentarz",
					description: `Dodano komentarz do zadania którego jesteś członkiem.`,
					link: `/projects/${task.project}/tasks/${taskId}`, // Adjust link to point to the team page or relevant resource
				};
				await notificationService.createNotification(notificationPayload);
			} else {
				message.error(response.message);
				throw new Error(response.message);
			}
		} catch (error) {
			message.error(error.message);
			dispatch(SetLoading(false));
		}
	};

	const onDeleteComment = async (id) => {
		try {
			dispatch(SetLoading(true));
			const response = await commentService.deleteComment(taskId, id);
			if (response.success) {
				message.success(response.message);
				reloadData();
			} else {
				message.error(response.message);
				throw new Error(response.error);
			}
		} catch (error) {
			dispatch(SetLoading(false));
		}
	};

	const reloadData = async () => {
		await fetchTaskData();
		await fetchAllComments();
	};

	const showDeleteTaskModal = () => {
		setIsDeleteModalVisible(true);
	};

	const closeDeleteTaskModal = () => {
		setIsDeleteModalVisible(false);
	};

	const showAddUserModal = () => {
		setIsModalVisible(true);
	};

	const closeAddUserModal = () => {
		setIsModalVisible(false);
	};

	const confirmDeleteTask = async () => {
		try {
			dispatch(SetLoading(true));
			const response = await taskService.deleteTask(taskId);
			if (response.success) {
				message.success(response.message);
				navigate(`/projects/${projectId}/tasks`);

				const notificationPayload = {
					users: task.members, // Array of user IDs
					title: "Usunięto zadanie",
					description: `Usunięto zadanie którego byłeś członkiem.`,
					link: `/projects/${task.project}/tasks`, // Adjust link to point to the team page or relevant resource
				};
				await notificationService.createNotification(notificationPayload);
			} else {
				throw new Error(response.error);
			}
			dispatch(SetLoading(false));
		} catch (error) {
			dispatch(SetLoading(false));
			message.error(error.message);
		}
	};

	useEffect(() => {
		reloadData();
	}, [taskId]);

	if (task && task.members) {
		console.log("TASK: ", task);
		console.log("TASK MEMBERS: ", task.members);
	}

	return (
		task && (
			<div className="container mx-auto my-5 p-5">
				<div className="flex justify-between items-center mb-6">
					<div>
						<h1 className="text-3xl font-bold text-gray-900 mb-2">
							{task.name}
						</h1>
						<p className="mb-2">
							Data utworzenia: {getSimpleDateFormat(task.createdAt)}
						</p>
						{(user.role === "TEAM LEADER" || user._id === task.createdBy) && (
							<Button type="primary" danger onClick={showDeleteTaskModal}>
								Usuń zadanie
							</Button>
						)}
					</div>
					{isDeleteModalVisible && (
						<Modal
							title="Potwierdź operację"
							open={isDeleteModalVisible}
							onOk={confirmDeleteTask}
							onCancel={closeDeleteTaskModal}
							okText="Tak"
							cancelText="Anuluj"
						>
							<p>Czy na pewno chcesz usunąć to zadanie?</p>
							<p>
								Wszystkie składowe - komentarze, pliki - również zostaną
								usunięte
							</p>
						</Modal>
					)}
					{/* Task Status */}
					<div c>
						<h2 className="text-2xl font-semibold text-gray-800 mb-3">
							Status zadania
						</h2>

						<Select
							value={translateStatus(status)}
							style={{ width: 200 }}
							onChange={(newStatus) => handleStatusChange(newStatus)}
							disabled={allowedTransitions?.length === 0}
						>
							{allowedTransitions.map((transitionStatus) => (
								<Option key={transitionStatus} value={transitionStatus}>
									{translateStatus(transitionStatus)}
								</Option>
							))}
						</Select>
					</div>
					{/* Task Priority  */}
					<div className="flex justify-center items-center flex-col">
						<h2 className="text-2xl font-semibold text-gray-800 mb-3">
							Stopień ważności
						</h2>

						<Button
							type="primary"
							onClick={handlePriorityChange}
							className={` ${
								priority === "low"
									? "bg-green-500"
									: priority === "medium"
									? "bg-blue-500"
									: "bg-red-500"
							}`}
						>
							{priority === "low"
								? "Niski"
								: priority === "medium"
								? "Średni"
								: "Wysoki"}
						</Button>
					</div>
					{/* Due date */}
					<div>
						<h2 className="text-2xl font-semibold text-gray-800 mb-3">
							Planowana data zakończenia:
						</h2>
						<h3 className="text-center">{getSimpleDateFormat(task.dueDate)}</h3>
					</div>

					{/* {user.role === "TEAM LEADER" && (
						<Button type="primary" onClick={showAddUserModal}>
							Dodaj pracownika
						</Button>
					)} */}
				</div>

				<div className="md:flex no-wrap md:-mx-2 ">
					{/* Tu będzie lista członków zadania w stylu UserList 
					+ możliwośc dodawania i usuwania */}
					<div className="w-full md:w-3/12 md:mx-2 ">
						{(user.role === "TEAM LEADER" || user._id === task.createdBy) && (
							<Button
								type="primary"
								onClick={showAddUserModal}
								className="mb-4"
							>
								Dodaj pracownika
							</Button>
						)}

						<UserList
							users={task.members}
							title="Członkowie"
							showDelete={
								user.role === "TEAM LEADER" || user._id === task.createdBy
							}
							onDelete={removeMember}
							creatorId={task.createdBy}
						/>
					</div>
					{/* Task Description */}

					<div className="w-full md:w-6/12 mx-2 ">
						<Row gutter={16}>
							<Col span={24} className="mb-8">
								<div
									className="mb-6 bg-indigo-100 p-4 rounded-md shadow-md"
									style={{ minHeight: "150px" }}
								>
									{" "}
									<div className="flex justify-between items-center">
										<h2 className="text-xl font-semibold text-gray-800">
											Opis zadania
										</h2>
										{(user.role === "TEAM LEADER" ||
											user._id === task.createdBy) &&
											!editMode && (
												<Button
													type="default"
													onClick={() => setEditMode(true)}
												>
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
							</Col>
							<Col span={24}>
								{/* Komentarze */}

								{comments && (
									<Comments
										comments={comments}
										currentUserId={user._id}
										onDeleteComment={onDeleteComment}
									/>
								)}
								<CommentInput onCommentSubmit={handleCommentSubmit} />
							</Col>
						</Row>
					</div>
					{(user.role === "TEAM LEADER" ||
						task.members.some((member) => member._id === user._id)) && (
						<div className="w-full md:w-3/12 mx-2 ">
							<Row gutter={16}>
								<Col span={24} className="mb-8">
									{/* FileUpload component */}
									<FileUpload onFileUpload={handleFileUpload} />
								</Col>
								<Col span={24}>
									{/* FileList component */}
									<FileList
										attachments={task?.attachments}
										onDelete={removeFile}
									/>
								</Col>
							</Row>
						</div>
					)}

					<AddUserForm
						task={task}
						isVisible={isModalVisible}
						onClose={closeAddUserModal}
						reloadData={reloadData}
					/>
				</div>
			</div>
		)
	);
}

export default Task;
