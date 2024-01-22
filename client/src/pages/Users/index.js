import React, { useEffect, useState } from "react";
import { message, Table } from "antd";
import userService from "../../services/user";
import { useSelector, useDispatch } from "react-redux";
import { SetLoading } from "../../redux/loadersSlice";
import { getSimpleDateFormat } from "../../utils/helpers";
import { useNavigate } from "react-router-dom";
import { IoTrashBin } from "react-icons/io5";

function Users() {
	const { user } = useSelector((state) => state.users);
	const [users, setUsers] = useState([]);
	const dispatch = useDispatch();

	const isAdmin = user.role === "ADMIN";

	const navigate = useNavigate();

	const fetchUsers = async () => {
		try {
			dispatch(SetLoading(true));
			const response = await userService.getAllUsers();
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

	const onDelete = async (id) => {
		try {
			dispatch(SetLoading(true));
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
		{
			title: "Imię",
			dataIndex: "firstName",
			sorter: (a, b) => a.firstName.localeCompare(b.firstName),
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
			sorter: (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
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
							navigate(`/teams/${team._id}`);
						}}
						style={{ color: "#1890ff", cursor: "pointer" }}
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

	return isAdmin ? (
		<div>
			<Table
				columns={columns}
				dataSource={users}
				onRow={onRowClick}
				className="mt-4"
			/>
		</div>
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
export default Users;
