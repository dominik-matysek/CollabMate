import React, { useState, useEffect } from "react";
import { Modal, Form, Select, message, Button, Checkbox } from "antd";
import userService from "../../../services/user";
import teamService from "../../../services/team";
import { SetButtonLoading } from "../../../redux/loadersSlice";
import { getAntdFormInputRules } from "../../../utils/helpers";
import { useDispatch } from "react-redux";

const AddUserForm = ({ teamId, isVisible, onClose, reloadData }) => {
	const [form] = Form.useForm();
	const [users, setUsers] = useState([]);
	const [roleType, setRoleType] = useState("EMPLOYEE");
	const dispatch = useDispatch();
	const [selectedUserIds, setSelectedUserIds] = useState([]);

	const fetchUsers = async () => {
		try {
			const response = await userService.getAllUsers();
			if (response.success) {
				setUsers(
					response.data.filter((user) => !user.team && user.role !== "ADMIN")
				);
				form.resetFields();
			} else {
				throw new Error(response.message);
			}
		} catch (error) {
			message.error(error.message);
		}
	};

	useEffect(() => {
		if (isVisible) {
			fetchUsers();
		}
	}, [isVisible]);

	const handleOk = async () => {
		try {
			dispatch(SetButtonLoading(true));
			const values = await form.validateFields();
			const payload = {
				userIds: values.user,
				roleType: roleType, // "member" or "leader"
			};
			const response = await teamService.addUsersToTeam(teamId, payload);
			dispatch(SetButtonLoading(false));
			if (response.success) {
				message.success("User(s) added successfully");
				onClose();
			} else {
				throw new Error(response.error);
			}
		} catch (error) {
			dispatch(SetButtonLoading(false));
			message.error(error.message);
		}
	};

	return (
		<Modal
			title="Dodaj użytkowników do zespołu"
			open={isVisible}
			onOk={handleOk}
			onCancel={onClose}
			footer={[
				<Button className="mt-4" key="back" onClick={onClose}>
					Anuluj
				</Button>,
				<Button key="submit" type="primary" onClick={handleOk}>
					Dodaj użytkownika
				</Button>,
			]}
		>
			<Form form={form} layout="vertical">
				<Form.Item
					name="user"
					label="Wybierz użytkownika"
					rules={getAntdFormInputRules}
				>
					<Select
						showSearch
						mode="multiple"
						placeholder="Wybierz użytkownika"
						optionFilterProp="children"
						filterOption={(input, option) =>
							option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
						}
					>
						{users.map((user) => (
							<Select.Option key={user._id} value={user._id}>
								{user.firstName} {user.lastName}
							</Select.Option>
						))}
					</Select>
				</Form.Item>
			</Form>
			<div>
				<Button
					onClick={() => setRoleType("EMPLOYEE")}
					type={roleType === "EMPLOYEE" ? "primary" : "default"}
					className="mr-4"
				>
					Dodaj pracownika
				</Button>
				<Button
					onClick={() => setRoleType("TEAM LEADER")}
					type={roleType === "TEAM LEADER" ? "primary" : "default"}
				>
					Dodaj lidera
				</Button>
				{/* <Checkbox
					onClick={() => setRoleType("EMPLOYEE")}
					type={roleType === "EMPLOYEE" ? "primary" : "default"}
				>
					Dodaj pracownika
				</Checkbox>
				<Checkbox
					onClick={() => setRoleType("TEAM LEADER")}
					type={roleType === "TEAM LEADER" ? "primary" : "default"}
				>
					Dodaj lidera
				</Checkbox> */}
			</div>
		</Modal>
	);
};

export default AddUserForm;
