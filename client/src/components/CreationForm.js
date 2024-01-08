import React from "react";
import { Form, Input, Button, Select } from "antd";
import getAntdFormInputRules from "../utils/helpers";

function CreationForm({ formType, onSubmit, users }) {
	const [form] = Form.useForm();

	// Determine the placeholder text based on formType
	const getPlaceholderText = () => {
		switch (formType) {
			case "team":
				return "Nazwa zespołu";
			case "project":
				return "Nazwa projektu";
			case "task":
				return "Nazwa zadania";
			default:
				return "";
		}
	};

	// Handle form submission
	const handleFormSubmit = (values) => {
		// Call the passed onSubmit function with form values and type
		onSubmit(values, formType);
	};

	return (
		<Form form={form} onFinish={handleFormSubmit} layout="vertical">
			<Form.Item name="name" rules={getAntdFormInputRules}>
				<Input placeholder={getPlaceholderText()} />
			</Form.Item>
			{/* Conditional rendering based on formType */}
			{formType === "team" && (
				<Form.Item name="teamLeaders">
					<Select mode="multiple" placeholder="Wybierz lidera">
						{users
							.filter((user) => user.role === "EMPLOYEE" && !user.team)
							.map((user) => (
								<Option key={user._id} value={user._id}>
									{user.firstName} {user.lastName}
								</Option>
							))}
					</Select>
				</Form.Item>
			)}
			{/* Similar conditional rendering can be applied for other specific fields */}
			<Form.Item>
				<Button type="primary" htmlType="submit">
					Create
				</Button>
			</Form.Item>
		</Form>
	);
}

export default CreationForm;
