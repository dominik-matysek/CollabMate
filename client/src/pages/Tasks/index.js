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
	const [tasks, setTasks] = useState([]);
	const [members, setMembers] = useState([]);
	const dispatch = useDispatch();
	const [statsData, setStatsData] = useState([]);

	const fetchProjectMembers = async () => {
		try {
			// Add loading state handling if needed
			dispatch(SetLoading(true));

			const response = await projectService.getProjectById(projectId); // Adjust with your actual API call
			if (response.success) {
				setMembers(response.data.members);
				console.log("Raz: ", response.data.members);
				console.log("Dwa: ", members);
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

	return (
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
	);
}

export default Tasks;
