import React, { useEffect, useState } from "react";
import { Form, Input, Button, message, Table, Col, Row } from "antd";
import { Link, useNavigate, useParams } from "react-router-dom";
import taskService from "../../services/task";
import projectService from "../../services/project";
import { useSelector, useDispatch } from "react-redux";
import { SetLoading, SetButtonLoading } from "../../redux/loadersSlice";
import { SetNotifications, SetUser } from "../../redux/usersSlice";
import TaskForm from "./TaskForm";
import SingleTaskCard from "../../components/SingleTaskCard";
import StatsCard from "../../components/StatsCard";
import UserList from "../../components/UserList";

function Tasks() {
	const { user } = useSelector((state) => state.users);
	const { projectId } = useParams();
	const [project, setProject] = useState();
	const [tasks, setTasks] = useState([]);
	const [members, setMembers] = useState([]);
	const dispatch = useDispatch();
	const [statsData, setStatsData] = useState([]);

	const teamId = project ? project.team : null;

	const isSameTeam = teamId === user.team._id;

	const fetchProjectMembers = async () => {
		try {
			// Add loading state handling if needed
			dispatch(SetLoading(true));

			const response = await projectService.getProjectById(projectId); // Adjust with your actual API call
			if (response.success) {
				setMembers(response.data.members);
				setProject(response.data);
			} else {
				throw new Error(response.error);
			}

			dispatch(SetLoading(false));
		} catch (error) {
			dispatch(SetLoading(false));
			message.error(error.message);
		}
	};

	const fetchTasks = async () => {
		try {
			dispatch(SetLoading(true));
			const response = await taskService.getAllTasks(projectId); // Replace with your actual API endpoint
			if (response.success) {
				setTasks(response.data);
			} else {
				throw new Error(response.error);
			}
			dispatch(SetLoading(false));
		} catch (error) {
			dispatch(SetLoading(false));
			message.error(error.message);
		}
	};

	const countStats = () => {
		const taskCount = tasks.length;
		const employeeCount = members.length;

		setStatsData([
			{ title: "Zadania", value: taskCount },
			{ title: "Pracownicy", value: employeeCount },
		]);
	};

	const reloadAllData = async () => {
		await fetchProjectMembers();
		await fetchTasks();
	};

	useEffect(() => {
		reloadAllData();
	}, []);

	useEffect(() => {
		countStats();
	}, [tasks, members]); // Depend on teams and users

	return isSameTeam ? (
		<>
			<Row gutter={24} className="w-full container mx-auto p-6">
				<Col span={16}>
					<div className="pr-3 pb-9">
						<StatsCard stats={statsData} />
					</div>
					{tasks.map((task, index) => (
						<div className="pr-3 pb-3">
							<SingleTaskCard key={index} item={task} />
						</div>
					))}
				</Col>

				<Col span={8}>
					{/* User musi być albo team leaderem albo być członkiem projektu*/}
					{(user.role === "TEAM LEADER" ||
						members.some((member) => member._id === user._id)) && (
						<TaskForm
							user={user}
							projectId={projectId}
							users={members}
							reloadData={reloadAllData}
						/>
					)}
					<UserList users={members} title="Członkowie" />
				</Col>
			</Row>
		</>
	) : (
		<div class="flex items-center justify-center h-screen">
			<div>
				<h1 class="text-4xl font-bold text-center" style={{ color: "#138585" }}>
					403 - Forbidden
				</h1>
				<p class="text-2xl text-center">
					Niestety, nie posiadasz dostępu do tej zawartości
				</p>
			</div>
		</div>
	);
}

export default Tasks;
