import React, { useState, useEffect } from "react";
import {
	Form,
	Input,
	DatePicker,
	Button,
	Select,
	List,
	message,
	Avatar,
	Divider,
} from "antd";
import { IoTrashBin, IoBuild, IoPerson } from "react-icons/io5";
import { SetLoading, SetButtonLoading } from "../../redux/loadersSlice";
import { useSelector, useDispatch } from "react-redux";
import eventService from "../../services/event";
import notificationService from "../../services/notification";
import moment from "moment";
import { useNavigate } from "react-router-dom";
const { Option } = Select;
function EventForm({
	eventDetails,
	onSave,
	onCancel,
	currentUser,
	allMembers,
	reloadData,
	reloadEventData,
}) {
	const [form] = Form.useForm();
	const [selectedMembers, setSelectedMembers] = useState([]);
	const [formChanged, setFormChanged] = useState(false);
	const navigate = useNavigate();
	const dispatch = useDispatch();

	const dateFormat = "DD/MM/YYYY";

	const isEditable =
		currentUser._id === eventDetails.createdBy ||
		currentUser.role === "TEAM LEADER";

	const filteredMembers = allMembers.filter(
		(member) =>
			!eventDetails.members.some((eMember) => eMember._id === member._id)
	);

	const addMember = async () => {
		try {
			dispatch(SetButtonLoading(true));
			const values = await form.validateFields();
			const payload = {
				memberIds: values.member,
				// roleType: roleType, // "member" or "leader"
			};
			const response = await eventService.addMembersToEvent(
				eventDetails._id,
				payload
			);
			dispatch(SetButtonLoading(false));
			if (response.success) {
				message.success("User(s) added successfully");
				setSelectedMembers(null);
				reloadEventData(eventDetails._id);

				const notificationPayload = {
					users: values.member, // Array of user IDs
					title: "Dodano cię do wydarzenia",
					description: `Zostałeś dodany do wydarzenia w twoim zespole: ${eventDetails.name}.`,
					link: `/teams/${eventDetails.team}/events`, // Adjust link to point to the team page or relevant resource
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

	const removeMember = async (id) => {
		try {
			dispatch(SetLoading(true));
			console.log("w onDelete, oto id:", id);
			const response = await eventService.removeMemberFromEvent(
				eventDetails._id,
				id
			);
			if (response.success) {
				message.success(response.message);
				reloadEventData(eventDetails._id);

				const notificationPayload = {
					users: id, // Array of user IDs
					title: "Usunięto cię z wydarzenia",
					description: `Zostałeś usunięty z wydarzenia w twoim zespole: ${eventDetails.name}.`,
					link: `/teams/${eventDetails.team}/events`, // Adjust link to point to the team page or relevant resource
				};
				await notificationService.createNotification(notificationPayload);
			} else {
				message.error(response.message);
				throw new Error(response.error);
			}
			dispatch(SetLoading(false));
		} catch (error) {
			dispatch(SetLoading(false));
		}
	};

	const deleteEvent = async () => {
		try {
			dispatch(SetLoading(true));
			const response = await eventService.deleteEvent(eventDetails._id);
			if (response.success) {
				message.success(response.message);
				onCancel();
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

	useEffect(() => {
		form.setFieldsValue({
			title: eventDetails.title,
			description: eventDetails.description,
			date: eventDetails.date ? moment(eventDetails.date) : null,
		});

		// Reset state when event details change
		setFormChanged(false);
		setSelectedMembers(null);
	}, [eventDetails, form]);

	const handleSubmit = (values) => {
		onSave(values);
		setFormChanged(false);
	};

	const handleValuesChange = (_, allValues) => {
		const hasChanged =
			allValues.title !== eventDetails.title ||
			allValues.description !== eventDetails.description ||
			setFormChanged(hasChanged);
	};

	return (
		<Form
			form={form}
			layout="vertical"
			onFinish={handleSubmit}
			onValuesChange={handleValuesChange}
		>
			<Form.Item label="Tytuł" name="title">
				<Input disabled={!isEditable} />
			</Form.Item>
			<Form.Item label="Opis" name="description">
				<Input.TextArea disabled={!isEditable} />
			</Form.Item>
			<Form.Item label="Data" name="date">
				<DatePicker
					placeholder="Termin wykonania"
					style={{ width: "100%" }}
					format={dateFormat}
					disabled={true}
					disabledDate={(current) => {
						// Disabling past dates including today
						return current && current < moment().startOf("day");
					}}
				/>
			</Form.Item>
			<Divider>Biorą udział</Divider>
			<List
				dataSource={eventDetails.members}
				renderItem={(member) => (
					<List.Item
						className="cursor-pointer"
						onClick={() => navigate(`/profile/${member._id}`)}
						actions={[
							(currentUser._id === eventDetails.createdBy ||
								currentUser.role === "TEAM LEADER") &&
								currentUser._id !== member._id && (
									<IoTrashBin
										onClick={(e) => {
											e.stopPropagation(); // Prevents event from propagating to the list item
											removeMember(member._id);
										}}
									/>
								),
						].filter(Boolean)}
					>
						<List.Item.Meta
							avatar={<Avatar src={member.profilePic} />}
							title={
								<>
									{`${member.firstName} ${member.lastName} `}
									{member._id === eventDetails.createdBy && (
										<span className="text-xs text-gray-400">
											- <IoPerson /> Założyciel
										</span>
									)}
								</>
							}
							description={
								<>
									<p className="text-xs">
										{member.role}
										{/* Displaying role with a team icon */}
									</p>
								</>
							}
						/>
					</List.Item>
				)}
			/>
			{isEditable && (
				<>
					<Divider />
					<Form.Item label="Dodaj członków" name="member">
						<Select
							showSearch
							mode="multiple"
							placeholder="Wybierz użytkownika"
							optionFilterProp="children"
							filterOption={(input, option) =>
								option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
							}
							onChange={setSelectedMembers}
							disabled={!isEditable}
							value={selectedMembers}
						>
							{filteredMembers.map((member) => (
								<Select.Option key={member._id} value={member._id}>
									{member.firstName} {member.lastName}
								</Select.Option>
							))}
						</Select>
					</Form.Item>
					<Button
						type="primary"
						onClick={addMember}
						disabled={
							!Array.isArray(selectedMembers) ||
							selectedMembers.length === 0 ||
							!isEditable
						}
					>
						Dodaj użytkownika
					</Button>
					<div className="flex justify-between mt-4">
						<Button danger type="primary" onClick={deleteEvent}>
							Usuń wydarzenie
						</Button>
						<div>
							<Button onClick={onCancel} className="mr-2">
								Anuluj
							</Button>
							<Button
								type="primary"
								htmlType="submit"
								disabled={!formChanged || !isEditable}
							>
								Zapisz
							</Button>
						</div>
					</div>
				</>
			)}
		</Form>
	);
}

export default EventForm;

// import React, { useState, useEffect } from "react";
// import { Form, Input, DatePicker, Button, Select, message } from "antd";
// import moment from "moment";
// import eventService from "../../services/event";
// import { SetLoading, SetButtonLoading } from "../../redux/loadersSlice";
// import { useSelector, useDispatch } from "react-redux";

// function EventForm({
// 	eventDetails,
// 	onSave,
// 	onCancel,
// 	currentUser,
// 	allMembers,
// }) {
// 	const [form] = Form.useForm();
// 	const [formChanged, setFormChanged] = useState(false);
// 	const dispatch = useDispatch();

// 	const isEditable =
// 		currentUser._id === eventDetails.createdBy ||
// 		currentUser.role === "TEAM LEADER";

// 	const addMember = async () => {
// 		try {
// 			dispatch(SetButtonLoading(true));
// 			const values = await form.validateFields();
// 			const payload = {
// 				memberData: values.member,
// 				// roleType: roleType, // "member" or "leader"
// 			};
// 			const response = await eventService.addMembersToEvent(
// 				eventDetails._id,
// 				payload
// 			);
// 			dispatch(SetButtonLoading(false));
// 			if (response.success) {
// 				message.success("User(s) added successfully");
// 				// onClose();
// 				// reloadData();
// 			} else {
// 				throw new Error(response.error);
// 			}
// 		} catch (error) {
// 			dispatch(SetButtonLoading(false));
// 			message.error(error.message);
// 		}
// 	};

// 	const removeMember = async (id) => {
// 		try {
// 			dispatch(SetLoading(true));
// 			console.log("w onDelete, oto id:", id);
// 			const response = await eventService.removeMemberFromEvent(
// 				eventDetails._id,
// 				id
// 			);
// 			if (response.success) {
// 				message.success(response.message);
// 				// reloadData();
// 			} else {
// 				message.error(response.message);
// 				throw new Error(response.error);
// 			}
// 			dispatch(SetLoading(false));
// 		} catch (error) {
// 			dispatch(SetLoading(false));
// 		}
// 	};

// 	useEffect(() => {
// 		form.setFieldsValue({
// 			title: eventDetails.title,
// 			description: eventDetails.description,
// 			date: moment(eventDetails.date),
// 			members: eventDetails.members.map((member) => member.id),
// 		});
// 	}, [eventDetails, form]);

// 	const handleSubmit = (values) => {
// 		onSave(values);
// 	};

// 	return (
// 		<Form form={form} layout="vertical" onFinish={handleSubmit}>
// 			<Form.Item label="Tytuł" name="title">
// 				<Input disabled={!isEditable} />
// 			</Form.Item>
// 			<Form.Item label="Opis" name="description">
// 				<Input.TextArea disabled={!isEditable} />
// 			</Form.Item>
// 			<Form.Item label="Data" name="date">
// 				<DatePicker disabled={!isEditable} />
// 			</Form.Item>
// 			<Form.Item label="Członkowie" name="members">
// 				<Select
// 					mode="multiple"
// 					options={allMembers.map((member) => ({
// 						value: member._id,
// 						label: member.firstName,
// 					}))}
// 					disabled={!isEditable}
// 				/>
// 			</Form.Item>
// 			{isEditable && (
// 				<div className="flex justify-end mt-4">
// 					<Button onClick={onCancel} className="mr-2">
// 						Anuluj
// 					</Button>
// 					<Button type="primary" htmlType="submit">
// 						Zapisz
// 					</Button>
// 				</div>
// 			)}
// 		</Form>
// 	);
// }

// export default EventForm;
