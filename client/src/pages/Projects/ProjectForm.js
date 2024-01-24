import { Form, Input, message, Select, Button, Card } from "antd";
import React from "react";
import { useDispatch } from "react-redux";
import { SetLoading } from "../../redux/loadersSlice";
import { getAntdFormInputRules } from "../../utils/helpers";
import projectService from "../../services/project";
import notificationService from "../../services/notification";

const { Option } = Select;

function ProjectForm({ teamId, reloadData, users }) {
	const [form] = Form.useForm();
	const dispatch = useDispatch();

	const onFinish = async (values) => {
		try {
			dispatch(SetLoading(true));

			const payload = {
				name: values.name,
				description: values.description,
				memberIds: values.members,
			};
			const response = await projectService.createProject(teamId, payload);

			if (response.success) {
				message.success(response.message);

				form.resetFields();
				reloadData();

				const notificationPayload = {
					users: values.members,
					title: "Nowy projekt",
					description: `Zostałeś dodany do nowego projektu w swoim zespole.`,
					link: `/teams/${teamId}/projects`,
				};
				await notificationService.createNotification(notificationPayload);
			} else {
				throw new Error(response.error);
			}
			dispatch(SetLoading(false));
		} catch (error) {
			dispatch(SetLoading(false));
			message.error(error.message);
		}
	};

	return (
		<Card title="Nowy projekt" bordered={false} className="w-full shadow-lg">
			<Form form={form} onFinish={onFinish} layout="vertical">
				<Form.Item name="name" rules={getAntdFormInputRules}>
					<Input placeholder="Nazwa projektu" />
				</Form.Item>
				<Form.Item name="members" rules={getAntdFormInputRules}>
					<Select
						mode="multiple"
						placeholder="Wybierz pracowników"
						filterOption={(input, option) =>
							option.children.toLowerCase().includes(input.toLowerCase())
						}
						showSearch
					>
						{users
							.filter((user) => user.role === "EMPLOYEE")
							.map((user) => (
								<Select.Option key={user._id} value={user._id}>
									{user.firstName} {user.lastName}
								</Select.Option>
							))}
					</Select>
				</Form.Item>

				<Form.Item
					name="description"
					rules={[
						...getAntdFormInputRules,
						{
							min: 5,
							max: 250,
							message: "Opis musi być dłuższy niż 5 i krótszy niż 250 znaków",
						},
					]}
				>
					<Input.TextArea placeholder="Opis projektu" allowClear />
				</Form.Item>

				<Form.Item>
					<Button type="primary" htmlType="submit" className="w-full">
						Utwórz projekt
					</Button>
				</Form.Item>
			</Form>
		</Card>
	);
}

export default ProjectForm;
