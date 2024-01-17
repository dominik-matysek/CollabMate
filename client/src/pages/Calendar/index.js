import React, { useState, useEffect } from "react";
import { Calendar, Modal, Button, message } from "antd";
import eventService from "../../services/event";
import teamService from "../../services/team";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { SetNotifications, SetUser } from "../../redux/usersSlice";
import { SetLoading, SetButtonLoading } from "../../redux/loadersSlice";
import AddEventForm from "./AddEventForm";
import EventForm from "./EventForm";
import moment from "moment";

function CalendarPage() {
	const { user } = useSelector((state) => state.users);
	const { teamId } = useParams();
	const dispatch = useDispatch();
	const [events, setEvents] = useState([]);
	const [members, setMembers] = useState([]);
	const [leaders, setLeaders] = useState([]);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [selectedEventDetails, setSelectedEventDetails] = useState(null);
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

	const fetchEventDetails = async (eventId) => {
		try {
			dispatch(SetLoading(true));

			const response = await eventService.getEventById(eventId); // Adjust with your actual API call

			if (response.success) {
				setSelectedEventDetails(response.data);
			} else {
				throw new Error(response.error);
			}
			dispatch(SetLoading(false));
		} catch (error) {
			dispatch(SetLoading(false));
			message.error(error.message);
		}
	};

	const fetchTeamMembers = async () => {
		try {
			// Add loading state handling if needed
			dispatch(SetLoading(true));
			const response = await teamService.getMembers(teamId); // Adjust with your actual API call
			if (response.success) {
				setMembers(response.data);
			} else {
				throw new Error(response.error);
			}
			dispatch(SetLoading(false));
		} catch (error) {
			dispatch(SetLoading(false));
			message.error(error.message);
		}
	};

	const fetchTeamLeaders = async () => {
		try {
			// Add loading state handling if needed
			dispatch(SetLoading(true));
			const response = await teamService.getLeaders(teamId); // Adjust with your actual API call
			if (response.success) {
				setLeaders(response.data);
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
		const selectedDateFormatted = value.format("YYYY-MM-DD");
		const dayEvents = events.filter(
			(event) =>
				moment(event.date).format("YYYY-MM-DD") === selectedDateFormatted
		);
		// const selectedDateFormatted = value.format("YYYY-MM-DD");

		// const dayEvents = events.filter((event) => {
		// 	const eventDateFormatted = moment(event.date).format("YYYY-MM-DD");
		// 	return eventDateFormatted === selectedDateFormatted;
		// });

		// console.log("Selected date formatted: ", selectedDateFormatted);
		// console.log("Day events: ", dayEvents);

		// setIsModalOpen(dayEvents.length > 0);
	};

	const handleCancel = () => {
		setIsModalOpen(false);
		setSelectedEventDetails(null);
	};

	const showAddEventModal = () => {
		setIsAddEventModalVisible(true);
	};

	const handleAddEventModalCancel = () => {
		setIsAddEventModalVisible(false);
	};

	const handleSaveEvent = async (updatedEventData) => {
		try {
			dispatch(SetLoading(true));

			// Determine if the basic event details (title, description, date) have changed
			const detailsChanged =
				updatedEventData.title !== selectedEventDetails.title ||
				updatedEventData.description !== selectedEventDetails.description ||
				updatedEventData.date !== selectedEventDetails.date;

			let response;

			// Edit event details if they have changed
			if (detailsChanged) {
				response = await eventService.editEvent(selectedEventDetails._id, {
					title: updatedEventData.title,
					description: updatedEventData.description,
					date: updatedEventData.date,
				});

				if (!response.success) {
					throw new Error(response.error);
				}
			}

			dispatch(SetLoading(false));
		} catch (error) {
			dispatch(SetLoading(false));
			message.error(error.message);
		}
	};

	const dateCellRender = (value) => {
		// const currentDayEvents = events.filter((event) =>
		// 	value.isSame(event.date, "day")
		// );

		// return (
		// 	<ul className="events space-y-2">
		// 		{currentDayEvents.map((event, index) => (
		// 			<li
		// 				key={event._id}
		// 				onClick={() => fetchEventDetails(event._id)}
		// 				className="cursor-pointer p-1 rounded bg-blue-100 hover:bg-blue-200"
		// 			>
		// 				<span className="event-indicator inline-block mr-2 rounded-full bg-blue-500 w-3 h-3"></span>
		// 				{event.title}
		// 			</li>
		// 		))}
		// 	</ul>
		// );

		const currentDayEvents = events.filter(
			(event) =>
				moment(event.date).format("YYYY-MM-DD") === value.format("YYYY-MM-DD")
		);

		return (
			<ul className="events space-y-2">
				{currentDayEvents.map((event) => (
					<li
						key={event._id}
						onClick={(e) => onEventClick(e, event._id)}
						className="cursor-pointer p-1 rounded bg-blue-100 hover:bg-blue-200"
					>
						<span className="event-indicator inline-block mr-2 rounded-full bg-blue-500 w-3 h-3"></span>
						{event.title}
					</li>
				))}
			</ul>
		);
	};

	const onEventClick = async (event, eventId) => {
		event.stopPropagation(); // Prevents triggering the onDateSelect
		await fetchEventDetails(eventId);
		await fetchTeamMembers();
		await fetchTeamLeaders();
		setIsModalOpen(true);
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
				cellRender={dateCellRender}
				onSelect={onDateSelect}
				className="bg-gray-100"
			/>
			<Modal
				title="Szczegóły wydarzenia"
				open={isModalOpen}
				onCancel={handleCancel}
				footer={null}
			>
				{selectedEventDetails && (
					<EventForm
						eventDetails={selectedEventDetails}
						onSave={handleSaveEvent} // Define this method to handle save
						onCancel={handleCancel} // Already defined in your code
						currentUser={user} // Current user data
						allMembers={[...leaders, ...members]} // Array of all members
					/>
				)}
			</Modal>
		</div>
	);
}

export default CalendarPage;
