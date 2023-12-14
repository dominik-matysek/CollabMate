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
			},
		],
	},
	{
		timestamps: true,
	}
);

module.exports = mongoose.model("Project", projectSchema);
