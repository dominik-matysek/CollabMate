import React, { useEffect, useState } from "react";
import { Form, Input, Button, message } from "antd";
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
import { FaPencilAlt } from "react-icons/fa";
import { Navigate } from "react-router-dom";
import CustomTable from "../../components/CustomTable";

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

	const onRowClick = (record) => {
		return {
			onClick: () => {
				navigate(`/team/${record._id}`);
			},
		};
	};

	useEffect(() => {
		fetchTeams();
		fetchUsers();
	}, []);

	const columns = [
		{
			title: "Nazwa",
			dataIndex: "name",
		},
		{
			title: "Lider zespołu",
			dataIndex: "teamLead",
			render: (teamLead) => `${teamLead.firstName} ${teamLead.lastName}`,
		},
		{
			title: "Liczba członków",
			dataIndex: "members",
			render: (members) => members.length,
		},
		{
			title: "Data utworzenia",
			dataIndex: "createdAt",
			render: (text) => getSimpleDateFormat(text),
		},
		{
			title: "Akcja",
			dataIndex: "action",
			render: (text, record) => {
				return (
					<div className="flex gap-4">
						<IoTrashBin onClick={() => onDelete(record._id)} />
						<FaPencilAlt
							onClick={() => {
								setSelectedTeam(record);
								setShow(true);
							}}
						/>
					</div>
				);
			},
		},
	];

	return (
		<div>
			{user.role === "ADMIN" && (
				<div className="flex justify-end">
					<Button
						type="default"
						onClick={() => {
							setSelectedTeam(null);
							setShow(true);
						}}
					>
						Utwórz zespół
					</Button>
				</div>
			)}
			<CustomTable columns={columns} data={teams} onRowClick={onRowClick} />
			{show && (
				<TeamForm
					show={show}
					setShow={setShow}
					reloadData={fetchTeams}
					team={selectedTeam}
					users={users}
				/>
			)}
		</div>
	);
}

export default Teams;
