import React, { useState, useEffect } from "react";
import { Calendar, Modal, Button, message } from "antd";
import eventService from "../../services/event";
import teamService from "../../services/team";
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { SetLoading } from "../../redux/loadersSlice";
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

	const isSameTeam = user.team._id === teamId;

	const fetchEvents = async () => {
		try {
			dispatch(SetLoading(true));

			const response = await eventService.getAllEvents(teamId);

			if (response.success) {
				setEvents(response.data);
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

			const response = await eventService.getEventById(eventId);

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
			dispatch(SetLoading(true));
			const response = await teamService.getMembers(teamId);
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
			dispatch(SetLoading(true));
			const response = await teamService.getLeaders(teamId);
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

	const reloadEventData = async (eventId) => {
		await fetchEventDetails(eventId);
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
	};

	const handleCancel = () => {
		setIsModalOpen(false);
		setSelectedEventDetails(null);
		reloadData();
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

			const detailsChanged =
				updatedEventData.title !== selectedEventDetails.title ||
				updatedEventData.description !== selectedEventDetails.description;

			let response;

			if (detailsChanged) {
				response = await eventService.editEvent(selectedEventDetails._id, {
					title: updatedEventData.title,
					description: updatedEventData.description,
				});

				if (response.success) {
					message.success(response.message);
				} else {
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
		event.stopPropagation(); // Zapobiega wywołaniu onDateSelect
		await fetchEventDetails(eventId);
		await fetchTeamMembers();
		await fetchTeamLeaders();
		setIsModalOpen(true);
	};

	return isSameTeam ? (
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
						onSave={handleSaveEvent}
						onCancel={handleCancel}
						currentUser={user}
						allMembers={[...leaders, ...members]}
						reloadData={reloadData}
						reloadEventData={reloadEventData}
					/>
				)}
			</Modal>
		</div>
	) : (
		<div class="flex items-center justify-center h-screen">
			<div>
				<h1 class="text-4xl font-bold text-center" style={{ color: "#138585" }}>
					403 - Forbidden
				</h1>
				<p class="text-2xl text-center">
					Niestety, nie posiadasz dostępu do tej zawartości
				</p>
			</div>
		</div>
	);
}

export default CalendarPage;
