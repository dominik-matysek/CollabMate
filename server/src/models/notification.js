const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const notificationSchema = new Schema(
	{
		users: [
			{
				type: Schema.Types.ObjectId,
				ref: "User",
				required: true,
			},
		],
		title: {
			type: String,
			required: true,
		},
		description: {
			type: String,
			required: true,
		},
		link: {
			type: String,
			required: true,
		},
		read: {
			type: Boolean,
			default: false,
		},
	},
	{
		timestamps: true,
	}
);

module.exports = mongoose.model("Notification", notificationSchema);
