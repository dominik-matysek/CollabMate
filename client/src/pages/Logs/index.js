import React, { useEffect, useState } from "react";
import { message, Table } from "antd";
import logService from "../../services/log";
import { useSelector, useDispatch } from "react-redux";
import { SetLoading } from "../../redux/loadersSlice";
import { getDateFormat } from "../../utils/helpers";

function Logs() {
	const { user } = useSelector((state) => state.users);
	const [logs, setLogs] = useState([]);
	const dispatch = useDispatch();

	const isAdmin = user.role === "ADMIN";

	const fetchLogs = async () => {
		try {
			dispatch(SetLoading(true));
			const response = await logService.getAllLogs();
			if (response.success) {
				setLogs(response.data);
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
		fetchLogs();
	}, []);

	let columns = [
		{
			title: "ID Użytkownika",
			dataIndex: "userId",
			sorter: (a, b) => a.userId.localeCompare(b.userId),
		},  
		{
			title: "Zdarzenie",
			dataIndex: "action",
			sorter: (a, b) => a.action.localeCompare(b.action),
		},
		{
			title: "Adres IP",
			dataIndex: "ipAddress",
			sorter: (a, b) => a.ipAddress.localeCompare(b.ipAddress),
		},
		{
			title: "Data zdarzenia",
			dataIndex: "createdAt",
			sorter: (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
			render: (text) => getDateFormat(text),
		},
	];

	return isAdmin ? (
		<div>
			<Table
				columns={columns}
				dataSource={logs}
				//onRow={onRowClick}
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
export default Logs;
