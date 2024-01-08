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
			enum: ["pending", "inProgress", "completed"],
			default: "pending",
		},
		priority: {
			type: String,
			required: true,
			enum: ["low", "medium", "high"],
		},
		createdBy: {
			type: Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		// niżej może nie tylko zdjęcia, ale też jakieś pliki typu pdf czy coś przydatne do tasków
		attachments: {
			type: Array,
			default: [],
		},
		dueDate: {
			type: Date,
		},
		comments: [
			{
				type: Schema.Types.ObjectId,
				ref: "Comment",
			},
		],
	},
	{ timestamps: true }
);

module.exports = mongoose.model("Task", taskSchema);
