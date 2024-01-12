import { Form, Input, message, Modal, Select, Button, Card } from "antd";
import TextArea from "antd/es/input/TextArea";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { SetLoading } from "../../redux/loadersSlice";
import { getAntdFormInputRules } from "../../utils/helpers";
import projectService from "../../services/project";

const { Option } = Select;

function ProjectForm({ teamId, reloadData, users }) {
	const [form] = Form.useForm();
	const dispatch = useDispatch();

	const onFinish = async (values) => {
		try {
			dispatch(SetLoading(true));
			// create team
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
						showSearch // Enables the search functionality
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
				{/* Add the description field here */}
				<Form.Item
					name="description"
					rules={[
						...getAntdFormInputRules,
						{
							min: 5,
							max: 50,
							message: "Opis musi być dłuższy niż 5 i krótszy niż 50 znaków",
						},
					]}
				>
					<Input.TextArea placeholder="Opis projektu" allowClear />
				</Form.Item>
				{/* Similar conditional rendering can be applied for other specific fields */}
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
