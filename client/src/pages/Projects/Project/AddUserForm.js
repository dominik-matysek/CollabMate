import React, { useState, useEffect } from "react";
import { Modal, Form, Select, message, Button } from "antd";
import teamService from "../../../services/team";
import { SetButtonLoading } from "../../../redux/loadersSlice";
import { getAntdFormInputRules } from "../../../utils/helpers";
import { useDispatch } from "react-redux";
import projectService from "../../../services/project";
import notificationService from "../../../services/notification";

const AddUserForm = ({ project, isVisible, onClose, reloadData }) => {
	const [form] = Form.useForm();
	const [members, setMembers] = useState([]);
	const dispatch = useDispatch();

	const fetchTeamMembers = async () => {
		try {
			const response = await teamService.getMembers(project.team);
			if (response.success) {
				const currentProjectMemberIds = project.members.map(
					(member) => member._id
				);
				const filteredMembers = response.data.filter(
					(member) => !currentProjectMemberIds.includes(member._id)
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
			fetchTeamMembers();
		}
	}, [isVisible]);

	const handleOk = async () => {
		try {
			dispatch(SetButtonLoading(true));
			const values = await form.validateFields();
			const payload = {
				userIds: values.member,
			};
			const response = await projectService.addMembersToProject(
				project._id,
				payload
			);
			dispatch(SetButtonLoading(false));
			if (response.success) {
				message.success(response.message);
				onClose();
				reloadData();

				const notificationPayload = {
					users: values.member,
					title: "Nowy projekt",
					description: `Zostałeś dodany do nowego projektu w swoim zespole.`,
					link: `/projects/${project._id}`,
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
			title="Dodaj użytkowników do projektu"
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
