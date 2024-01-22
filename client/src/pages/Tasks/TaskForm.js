import { Form, Input, message, Select, Button, Card, DatePicker } from "antd";
import React from "react";
import { useDispatch } from "react-redux";
import { SetLoading } from "../../redux/loadersSlice";
import { getAntdFormInputRules } from "../../utils/helpers";
import taskService from "../../services/task";
import moment from "moment";

const { Option } = Select;

function TaskForm({ user, projectId, reloadData, users }) {
	const [form] = Form.useForm();
	const dispatch = useDispatch();
	const currentUserId = user._id;

	const dateFormat = ["DD/MM/YYYY"];

	const onFinish = async (values) => {
		try {
			dispatch(SetLoading(true));

			const payload = {
				name: values.name,
				description: values.description,
				memberIds: values.members,
				priority: values.priority,
				dueDate: values.dueDate,
			};
			const response = await taskService.createTask(projectId, payload);

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
		<Card title="Nowe zadanie" bordered={false} className="w-full shadow-lg">
			<Form form={form} onFinish={onFinish} layout="vertical">
				<Form.Item name="name" rules={getAntdFormInputRules}>
					<Input placeholder="Nazwa zadania" />
				</Form.Item>
				<Form.Item name="members">
					<Select
						mode="multiple"
						placeholder="Wybierz pracowników"
						filterOption={(input, option) =>
							option.children.toLowerCase().includes(input.toLowerCase())
						}
						showSearch
					>
						{users
							.filter(
								(user) => user.role === "EMPLOYEE" && user._id !== currentUserId
							)
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
					<Input.TextArea placeholder="Opis zadania" allowClear />
				</Form.Item>

				<Form.Item
					name="dueDate"
					rules={[
						{ required: true, message: "Proszę wybrać termin wykonania" },
					]}
				>
					<DatePicker
						placeholder="Wybierz termin wykonania"
						style={{ width: "100%" }}
						format={dateFormat}
						disabledDate={(current) => {
							return current && current < moment().endOf("day");
						}}
					/>
				</Form.Item>

				<Form.Item
					name="priority"
					rules={[
						...getAntdFormInputRules,
						{
							message: "Proszę wybrać priorytet zadania",
						},
					]}
				>
					<Select placeholder="Wybierz priorytet">
						<Select.Option value="low">Niski</Select.Option>
						<Select.Option value="medium">Średni</Select.Option>
						<Select.Option value="high">Wysoki</Select.Option>
					</Select>
				</Form.Item>

				<Form.Item>
					<Button type="primary" htmlType="submit" className="w-full">
						Utwórz zadanie
					</Button>
				</Form.Item>
			</Form>
		</Card>
	);
}

export default TaskForm;
