import React, { useState } from "react";
import { Form, Input, Button, DatePicker, message } from "antd";
import eventService from "../../services/event";
import {
	getSimpleDateFormat,
	getAntdFormInputRules,
} from "../../utils/helpers";
import moment from "moment";
import { SetLoading } from "../../redux/loadersSlice";
import { useDispatch, useSelector } from "react-redux";

function AddEventForm({ teamId, reloadData }) {
	const [form] = Form.useForm();
	const dispatch = useDispatch();
	const dateFormat = ["DD/MM/YYYY"];

	const onFinish = async (values) => {
		try {
			dispatch(SetLoading(true));
			// Format the date to match your backend expectations
			const formattedValues = {
				...values,
				date: moment(values.date).format("YYYY-MM-DD"), // Or your desired format
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
			// Handle error
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
						// Can not select days before today and today
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
