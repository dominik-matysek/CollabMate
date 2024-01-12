const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const projectSchema = new Schema(
	{
		name: {
			type: String,
			required: true,
		},
		description: {
			type: String,
			required: true,
			minlength: 5,
			maxlength: 50,
		},
		status: {
			type: String,
			required: true,
			enum: ["active", "completed", "archived"],
			default: "active",
		},
		tasks: [
			{
				type: Schema.Types.ObjectId,
				ref: "Task",
			},
		],
		members: [
			{
				type: Schema.Types.ObjectId,
				ref: "User",
				required: true,
			},
		],
		team: [
			{
				type: Schema.Types.ObjectId,
				ref: "Team",
				required: true,
			},
		],
	},
	{
		timestamps: true,
	}
);

module.exports = mongoose.model("Project", projectSchema);
