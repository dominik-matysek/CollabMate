import React, { useEffect, useState } from "react";
import { message, Col, Row } from "antd";
import { useParams } from "react-router-dom";
import teamService from "../../services/team";
import projectService from "../../services/project";
import { useSelector, useDispatch } from "react-redux";
import { SetLoading } from "../../redux/loadersSlice";
import ProjectForm from "./ProjectForm";
import SingleProjectCard from "../../components/SingleProjectCard";
import StatsCard from "../../components/StatsCard";
import UserList from "../../components/UserList";

function Projects() {
	const { user } = useSelector((state) => state.users);
	const { teamId } = useParams();
	const [projects, setProjects] = useState([]);
	const [members, setMembers] = useState([]);
	const dispatch = useDispatch();
	const [statsData, setStatsData] = useState([]);
	const [leaders, setLeaders] = useState([]);

	const isSameTeam = user.team._id === teamId;

	const fetchTeamMembers = async () => {
		try {
			dispatch(SetLoading(true));
			const response = await teamService.getMembers(teamId);
			if (response.success) {
				setMembers(response.data);
			} else {
				throw new Error(response.error);
			}
			dispatch(SetLoading(false));
		} catch (error) {
			dispatch(SetLoading(false));
			message.error(error.message);
		}
	};

	const fetchTeamLeaders = async () => {
		try {
			dispatch(SetLoading(true));
			const response = await teamService.getLeaders(teamId);
			if (response.success) {
				setLeaders(response.data);
			} else {
				throw new Error(response.error);
			}
			dispatch(SetLoading(false));
		} catch (error) {
			dispatch(SetLoading(false));
			message.error(error.message);
		}
	};

	const fetchProjects = async () => {
		try {
			dispatch(SetLoading(true));
			const response = await projectService.getAllProjects(teamId);
			if (response.success) {
				setProjects(response.data);
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
		const projectCount = projects.length;
		const leaderCount = leaders.length;
		const employeeCount = members.length;

		setStatsData([
			{ title: "Projekty", value: projectCount },
			{ title: "Liderzy", value: leaderCount },
			{ title: "Pracownicy", value: employeeCount },
		]);
	};

	const reloadAllData = async () => {
		await fetchTeamMembers();
		await fetchTeamLeaders();
		await fetchProjects();
	};

	useEffect(() => {
		reloadAllData();
	}, []);

	useEffect(() => {
		countStats();
	}, [projects, members, leaders]);

	return isSameTeam ? (
		<>
			<Row gutter={24} className="w-full container mx-auto p-6">
				<Col span={16}>
					<div className="pr-3 pb-9">
						<StatsCard stats={statsData} />
					</div>
					{projects.map((project, index) => (
						<div className="pr-3 pb-3">
							<SingleProjectCard key={index} item={project} />
						</div>
					))}
				</Col>

				<Col span={8}>
					{user.role === "TEAM LEADER" && (
						<ProjectForm
							teamId={teamId}
							users={members}
							reloadData={reloadAllData}
						/>
					)}
					<div className="mt-10">
						<UserList users={[...leaders, ...members]} title="Członkowie" />
					</div>
				</Col>
			</Row>
		</>
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

export default Projects;
