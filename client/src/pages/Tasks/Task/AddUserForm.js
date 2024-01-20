import React, { useState, useEffect } from "react";
import { Modal, Form, Select, message, Button, Checkbox } from "antd";
import { SetButtonLoading } from "../../../redux/loadersSlice";
import { getAntdFormInputRules } from "../../../utils/helpers";
import { useDispatch } from "react-redux";
import projectService from "../../../services/project";
import taskService from "../../../services/task";
import notificationService from "../../../services/notification";

const AddUserForm = ({ task, isVisible, onClose, reloadData }) => {
	const [form] = Form.useForm();
	const [members, setMembers] = useState([]);
	const dispatch = useDispatch();
	const [selectedUserIds, setSelectedUserIds] = useState([]);

	const fetchProjectMembers = async () => {
		try {
			const response = await projectService.getProjectById(task.project);
			if (response.success) {
				const currentTaskMemberIds = task.members.map((member) => member._id);
				const filteredMembers = response.data.members.filter(
					(member) => !currentTaskMemberIds.includes(member._id)
				);
				setMembers(filteredMembers);
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
			fetchProjectMembers();
		}
	}, [isVisible]);

	const handleOk = async () => {
		try {
			dispatch(SetButtonLoading(true));
			const values = await form.validateFields();
			const payload = {
				userIds: values.member,
				// roleType: roleType, // "member" or "leader"
			};
			const response = await taskService.addMembersToTask(task._id, payload);
			dispatch(SetButtonLoading(false));
			if (response.success) {
				message.success("User(s) added successfully");
				onClose();
				reloadData();

				const notificationPayload = {
					users: values.members, // Array of user IDs
					title: "Dodano do zadania",
					description: `Zostałeś dodany do zadania w projekcie.`,
					link: `/projects/${task.project}/tasks/${task._id}`, // Adjust link to point to the team page or relevant resource
				};
				await notificationService.createNotification(notificationPayload);
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
			title="Dodaj użytkowników do zadania"
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
					name="member"
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
						{members.map((member) => (
							<Select.Option key={member._id} value={member._id}>
								{member.firstName} {member.lastName}
							</Select.Option>
						))}
					</Select>
				</Form.Item>
			</Form>
		</Modal>
	);
};

export default AddUserForm;
