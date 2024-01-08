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

	const onRowClick = (record) => {
		return {
			onClick: () => {
				navigate(`/profile/${record._id}`);
			},
		};
	};

	const stopPropagation = (e) => {
		e.stopPropagation();
	};

	//To możesz zmodyfikować gdybyś chciał pozwolić adminowi na całkowite wydupcenie usera z systemu, ale musisz do tego najpierw zrobić route i controller
	//   const onDelete = async (id) => {
	//     try {
	//       dispatch(SetLoading(true));
	//       const response = await teamService.deleteTeam(id);
	//       if (response.success) {
	//         message.success(response.message);
	//         fetchTeams();
	//       } else {
	//         throw new Error(response.error);
	//       }
	//       dispatch(SetLoading(false));
	//     } catch (error) {
	//       dispatch(SetLoading(false));
	//       message.error(error.message);
	//     }
	//   };

	useEffect(() => {
		fetchUsers();
	}, []);

	const columns = [
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
		{
			title: "Zespół",
			dataIndex: "teams",
			render: (teams) => {
				if (!teams || teams.length === 0) {
					return <span>Brak zespołów</span>;
				}

				// Menu for dropdown
				const menu = teams.map((team, index) => team.name);

				console.log(menu);
				return (
					<Dropdown
						trigger={["click"]}
						menu={{
							items: menu,
						}}
					>
						<a onClick={(e) => e.stopPropagation()}>
							Select Team <DownOutlined />
						</a>
					</Dropdown>
				);
			},
		},
		{
			title: "Akcja",
			dataIndex: "action",
			render: (text, record) => {
				return (
					<div className="flex gap-4">
						{/* Niżej możesz wrzucić onClick={() => onDelete(record._id)}  jak sie zdecydujesz na usuwanie usera */}
						<IoTrashBin />
					</div>
				);
			},
		},
	];

	return user.role === "ADMIN" ? (
		<div>
			<Table
				columns={columns}
				dataSource={users}
				onRow={onRowClick}
				className="mt-4"
			/>
		</div>
	) : (
		<div>
			<Table
				columns={columns}
				dataSource={users} //wszyscy uzytkownicy widoczni oprocz adminów
				onRow={onRowClick}
				className="mt-4"
			/>
		</div>
	);
}

export default Users;
