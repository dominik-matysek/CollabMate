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
		teamLeaders: [
			{
				type: Schema.Types.ObjectId,
				ref: "User",
				required: true,
			},
		],
		events: [
			{
				type: Schema.Types.ObjectId,
				ref: "Event",
			},
		],
	},
	{ timestamps: true }
);

module.exports = mongoose.model("Team", teamSchema);
