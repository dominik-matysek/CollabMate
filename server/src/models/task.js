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
			required: true, // to moze działać tak że członkowie projektu sobie tworzą zadania, ustalają ich status itp, ale mogą maks ustawic completed - status approved musi ustawić jeden z team leaderów, np. po tym jak pracownicy ustawią status completed team leaderzy dostają powiadomienie i jeden z nich moze ustawic approved
			// overdue wystepuje np automatycznie tylko wtedy gdy aktualna data jest po dueDate
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
		// niżej może nie tylko zdjęcia, ale też jakieś pliki typu pdf czy coś przydatne do tasków
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
