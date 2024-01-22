import { Form, Input, message, Select, Button, Card } from "antd";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { SetLoading } from "../../redux/loadersSlice";
import teamService from "../../services/team";
import { getAntdFormInputRules } from "../../utils/helpers";
import notificationService from "../../services/notification";

const { Option } = Select;

function TeamForm({ reloadData, users }) {
	const [form] = Form.useForm();
	const dispatch = useDispatch();
	const [availableUsers, setAvailableUsers] = useState(users);

	const onFinish = async (values) => {
		try {
			dispatch(SetLoading(true));

			const payload = {
				name: values.name,
				teamLeadIds: values.teamLeaders,
			};
			const response = await teamService.createTeam(payload);

			if (response.success) {
				message.success(response.message);

				setAvailableUsers((prevUsers) =>
					prevUsers.filter((user) => !values.teamLeaders.includes(user._id))
				);

				form.resetFields();
				reloadData();

				const notificationPayload = {
					users: values.teamLeaders,
					title: "Dodano do zespołu",
					description: `Zostałeś dodany do zespołu: ${values.name}.`,
					link: `/teams/${response.data._id}}`,
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

	useEffect(() => {
		setAvailableUsers(users);
	}, [users]);

	return (
		<Card title="Nowy zespół" bordered={false} className="w-full shadow-lg">
			<Form form={form} onFinish={onFinish} layout="vertical">
				<Form.Item name="name" rules={getAntdFormInputRules}>
					<Input placeholder="Nazwa zespołu" />
				</Form.Item>
				<Form.Item name="teamLeaders" rules={getAntdFormInputRules}>
					<Select
						mode="multiple"
						placeholder="Wybierz lidera/liderów"
						filterOption={(input, option) =>
							option.children.toLowerCase().includes(input.toLowerCase())
						}
						showSearch
					>
						{availableUsers
							.filter((user) => user.role === "EMPLOYEE" && !user.team)
							.map((user) => (
								<Select.Option key={user._id} value={user._id}>
									{user.firstName} {user.lastName}
								</Select.Option>
							))}
					</Select>
				</Form.Item>
				<Form.Item>
					<Button type="primary" htmlType="submit" className="w-full">
						Utwórz zespół
					</Button>
				</Form.Item>
			</Form>
		</Card>
	);
}

export default TeamForm;
