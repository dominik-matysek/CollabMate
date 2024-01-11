import React, { useEffect, useState } from "react";
import { Form, Input, Button, message, Table } from "antd";
import userService from "../../services/user";
import { useSelector, useDispatch } from "react-redux";
import { SetLoading, SetButtonLoading } from "../../redux/loadersSlice";
import { getSimpleDateFormat } from "../../utils/helpers";
import { Navigate, useNavigate } from "react-router-dom";
import { IoTrashBin } from "react-icons/io5";
import { Menu, Dropdown } from "antd";
import { DownOutlined } from "@ant-design/icons";

// PAMIĘTAJ DEBILU - JEŻELI REQUEST CI NIE DZIAŁA, TO PROBLEM NA 99% JEST W BACKENDZIE - SPRAWDZAJ LOGI W KONSOLI VSCODE A NIE WEBOWEJ JEŚLI CHODZI O BACKEND, SPRAWDZAJ CZY W REQUESCIE SIĘ ZNAJDUJĄ RZECZY KTÓRE SĄ OCZEKIWANE W KONTROLERZE ITP

function Users() {
	const { user } = useSelector((state) => state.users);
	const [users, setUsers] = useState([]);
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

	const onRowClick = (record) => {
		return {
			onClick: () => {
				navigate(`/profile/${record._id}`);
			},
			className: "cursor-pointer",
		};
	};

	// const stopPropagation = (e) => {
	// 	e.stopPropagation();
	// };

	const onDelete = async (id) => {
		try {
			dispatch(SetLoading(true));
			console.log("w onDelete, oto id:", id);
			const response = await userService.removeUserFromSystem(id);
			if (response.success) {
				message.success(response.message);
				fetchUsers();
			} else {
				message.error(response.message);
				throw new Error(response.error);
			}
			dispatch(SetLoading(false));
		} catch (error) {
			dispatch(SetLoading(false));
		}
	};

	useEffect(() => {
		fetchUsers();
	}, []);

	const uniqueTeamNames = Array.from(
		new Set(users.map((user) => user.team?.name).filter(Boolean))
	);

	const teamFilters = uniqueTeamNames.map((teamName) => ({
		text: teamName,
		value: teamName,
	}));

	let columns = [
		// Tu by mogło być jeszcze małe zdjecie profilowe kwadratowe albo okrągłe, jak juz ogarniesz zdjecia
		{
			title: "Imię",
			dataIndex: "firstName",
			sorter: (a, b) => a.firstName.localeCompare(b.firstName), // Sorting function for firstName
		},
		{
			title: "Nazwisko",
			dataIndex: "lastName",
			sorter: (a, b) => a.lastName.localeCompare(b.lastName),
		},
		{
			title: "Rola",
			dataIndex: "role",
			sorter: (a, b) => a.role.localeCompare(b.role),
		},
		{
			title: "Data dołączenia",
			dataIndex: "createdAt",
			sorter: (a, b) => new Date(a.createdAt) - new Date(b.createdAt), // Sorting function for createdAt
			render: (text) => getSimpleDateFormat(text),
		},
		{
			title: "Zespół",
			dataIndex: "team",
			filters: teamFilters,
			onFilter: (value, record) => record.team?.name === value,
			render: (team) =>
				team ? (
					<span
						onClick={(e) => {
							e.stopPropagation(); // Prevent onRowClick
							navigate(`/teams/${team._id}`); // Navigate to the team's page
						}}
						style={{ color: "#1890ff", cursor: "pointer" }} // Add cursor style for better UX
					>
						{team.name}
					</span>
				) : (
					<span>Brak zespołu</span>
				),
		},
	];

	if (user.role === "ADMIN") {
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
							{user._id !== record._id && (
								<IoTrashBin onClick={() => onDelete(record._id)} />
							)}
						</div>
					);
				},
			},
		];
	}

	return (
		<div>
			<Table
				columns={columns}
				dataSource={users}
				onRow={onRowClick}
				className="mt-4"
			/>
		</div>
	);
}

export default Users;
