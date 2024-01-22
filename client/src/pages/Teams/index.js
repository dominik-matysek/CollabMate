import React, { useEffect, useState } from "react";
import { message, Col, Row } from "antd";
import teamService from "../../services/team";
import userService from "../../services/user";
import { useSelector, useDispatch } from "react-redux";
import { SetLoading } from "../../redux/loadersSlice";
import TeamForm from "./TeamForm";
import SingleCard from "../../components/SingleCard";
import StatsCard from "../../components/StatsCard";
import UserList from "../../components/UserList";

function Teams() {
	const { user } = useSelector((state) => state.users);
	const [teams, setTeams] = useState([]);
	const [users, setUsers] = useState([]);
	const dispatch = useDispatch();
	const [statsData, setStatsData] = useState([]);
	const [leaders, setLeaders] = useState([]);

	const fetchUsers = async () => {
		try {
			dispatch(SetLoading(true));
			const response = await userService.getAllUsers();
			if (response.success) {
				setUsers(response.data);
				const leadersData = response.data.filter(
					(user) => user.role === "TEAM LEADER"
				);
				setLeaders(leadersData);
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
			const response = await teamService.getAllTeams();
			if (response.success) {
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

	const countStats = () => {
		const teamCount = teams.length;

		const leaderCount = users.filter(
			(user) => user.role === "TEAM LEADER"
		).length;
		const employeeCount = users.filter(
			(user) => user.role === "EMPLOYEE"
		).length;
		const adminCount = users.filter((user) => user.role === "ADMIN").length;

		setStatsData([
			{ title: "Zespoły", value: teamCount },
			{ title: "Liderzy", value: leaderCount },
			{ title: "Pracownicy", value: employeeCount },
			{ title: "Administratorzy", value: adminCount },
		]);
	};

	const reloadAllData = async () => {
		await fetchTeams();
		await fetchUsers();
	};

	useEffect(() => {
		reloadAllData();
	}, []);

	useEffect(() => {
		countStats();
	}, [teams, users]);

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

				<Col span={8}>
					{user.role === "ADMIN" && (
						<TeamForm users={users} reloadData={reloadAllData} />
					)}
					<div className="mt-10">
						<UserList users={leaders} title="Liderzy" />
					</div>
				</Col>
			</Row>
		</>
	);
}

export default Teams;
