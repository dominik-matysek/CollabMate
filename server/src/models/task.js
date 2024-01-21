const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const taskSchema = new Schema(
	{
		name: {
			type: String,
			required: true,
		},
		description: {
			type: String,
			required: true,
			minlength: 5,
			maxlength: 250,
		},
		members: [
			{
				type: Schema.Types.ObjectId,
				ref: "User",
			},
		],
		status: {
			type: String,
			required: true,
			enum: [
				"pending",
				"inProgress",
				"completed",
				"approved",
				"cancelled",
				"overdue",
			],
			default: "pending",
		},
		priority: {
			type: String,
			required: true,
			enum: ["low", "medium", "high"],
			default: "medium",
		},
		createdBy: {
			type: Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		attachments: [
			{
				type: String,
				default: [],
			},
		],
		dueDate: {
			type: Date,
		},
		comments: [
			{
				type: Schema.Types.ObjectId,
				ref: "Comment",
			},
		],
		project: {
			type: Schema.Types.ObjectId,
			ref: "Project",
			required: true,
		},
	},
	{ timestamps: true }
);

module.exports = mongoose.model("Task", taskSchema);
