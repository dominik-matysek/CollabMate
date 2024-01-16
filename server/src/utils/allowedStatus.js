const getAllowedStatusTransitions = (currentStatus, userRole) => {
	let transitions = {
		pending: ["inProgress"],
		inProgress: ["completed", "cancelled"],
		completed: ["cancelled"], // Removed "approved" from the initial list
		approved: [],
		cancelled: [],
		overdue: [],
	};

	// Only team leaders can move a task from 'completed' to 'approved'
	if (userRole === "TEAM LEADER" && currentStatus === "completed") {
		transitions.completed.push("approved");
	}

	return transitions[currentStatus] || [];
};

module.exports = {
	getAllowedStatusTransitions,
};
