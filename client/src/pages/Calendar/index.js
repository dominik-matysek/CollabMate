import React, { useState, useEffect } from "react";
import { Calendar, Modal, Button, message } from "antd";
import eventService from "../../services/event";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { SetNotifications, SetUser } from "../../redux/usersSlice";
import { SetLoading, SetButtonLoading } from "../../redux/loadersSlice";
import AddEventForm from "./AddEventForm";

function CalendarPage() {
	const { user } = useSelector((state) => state.users);
	const { teamId } = useParams();
	const dispatch = useDispatch();
	const [events, setEvents] = useState([]);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [selectedDate, setSelectedDate] = useState(null);
	const [isAddEventModalVisible, setIsAddEventModalVisible] = useState(false);

	const fetchEvents = async () => {
		try {
			// Add loading state handling if needed
			dispatch(SetLoading(true));

			const response = await eventService.getAllEvents(teamId); // Adjust with your actual API call

			if (response.success) {
				setEvents(response.data);
				console.log("Raz: ", response.data);
			} else {
				throw new Error(response.error);
			}

			dispatch(SetLoading(false));
		} catch (error) {
			dispatch(SetLoading(false));
			message.error(error.message);
		}
	};

	const reloadData = async () => {
		await fetchEvents();
	};

	useEffect(() => {
		reloadData();
	}, [teamId]);

	const onDateSelect = (value) => {
		setSelectedDate(value);
		setIsModalOpen(true);
	};

	const handleCancel = () => {
		setIsModalOpen(false);
	};

	const showAddEventModal = () => {
		setIsAddEventModalVisible(true);
	};

	const handleAddEventModalCancel = () => {
		setIsAddEventModalVisible(false);
	};

	const dateCellRender = (value) => {
		const dayEvents = events.filter(
			(event) =>
				new Date(event.date).toDateString() === value.toDate().toDateString()
		);

		return (
			<div>
				{dayEvents.map((event, index) => (
					<div key={index} className="bg-blue-200 rounded-lg p-1 text-sm">
						{event.title}
					</div>
				))}
			</div>
		);
	};

	return (
		<div>
			<Button type="primary" onClick={showAddEventModal}>
				Dodaj wydarzenie
			</Button>
			<Modal
				title="Dodaj wydarzenie"
				open={isAddEventModalVisible}
				onCancel={handleAddEventModalCancel}
				footer={null}
			>
				<AddEventForm
					teamId={teamId}
					reloadData={() => {
						reloadData();
						setIsAddEventModalVisible(false);
					}}
				/>
			</Modal>
			<Calendar
				dateCellRender={dateCellRender}
				onSelect={onDateSelect}
				className="bg-gray-100"
			/>
			<Modal
				title="Szczegóły wydarzenia"
				open={isModalOpen}
				onCancel={handleCancel}
				footer={null}
			>
				{selectedDate && <div></div>}
			</Modal>
		</div>
	);
}

export default CalendarPage;
