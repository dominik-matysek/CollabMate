const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const eventSchema = new Schema(
	{
		title: {
			type: String,
			required: true,
		},
		description: {
			type: String,
		},
		date: {
			type: Date,
			required: true,
		},
		createdBy: {
			type: Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		members: [
			{
				type: Schema.Types.ObjectId,
				ref: "User",
			},
		],
		team: {
			type: Schema.Types.ObjectId,
			ref: "Team",
		},
	},
	{ timestamps: true }
);

module.exports = mongoose.model("Event", eventSchema);
