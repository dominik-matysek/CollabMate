import React from "react";
import { Form, Input, Button, DatePicker, message } from "antd";
import eventService from "../../services/event";
import { getAntdFormInputRules } from "../../utils/helpers";
import moment from "moment";
import { SetLoading } from "../../redux/loadersSlice";
import { useDispatch } from "react-redux";

function AddEventForm({ teamId, reloadData }) {
	const [form] = Form.useForm();
	const dispatch = useDispatch();
	const dateFormat = ["DD/MM/YYYY"];

	const onFinish = async (values) => {
		try {
			dispatch(SetLoading(true));

			const formattedValues = {
				title: values.title,
				description: values.description,
				date: values.date,
			};

			const response = await eventService.createEvent(teamId, formattedValues);
			if (response.success) {
				message.success(response.message);

				form.resetFields();
				reloadData();
			} else {
				throw new Error(response.error);
			}
		} catch (error) {
			console.error("Error adding event:", error);
		}
	};

	return (
		<Form form={form} onFinish={onFinish} layout="vertical">
			<Form.Item
				name="title"
				label="Nazwa wydarzenia"
				rules={getAntdFormInputRules}
			>
				<Input />
			</Form.Item>
			<Form.Item name="description" label="Opis">
				<Input.TextArea />
			</Form.Item>
			<Form.Item name="date" label="Data" rules={getAntdFormInputRules}>
				<DatePicker
					placeholder="Wybierz datę"
					format={dateFormat}
					disabledDate={(current) => {
						return current && current < moment().startOf("day");
					}}
				/>
			</Form.Item>
			<Button type="primary" htmlType="submit">
				Dodaj wydarzenie
			</Button>
		</Form>
	);
}

export default AddEventForm;
