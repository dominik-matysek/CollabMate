const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const teamSchema = new Schema(
	{
		name: {
			type: String,
			required: true,
		},
		members: [
			{
				type: Schema.Types.ObjectId,
				ref: "User",
			},
		],
		projects: [
			{
				type: Schema.Types.ObjectId,
				ref: "Project",
			},
		],
		teamLead: {
			type: Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		calendar: {
			type: Schema.Types.ObjectId,
			ref: "Calendar",
			required: true,
		},
	},
	{ timestamps: true }
);

module.exports = mongoose.model("Team", teamSchema);
