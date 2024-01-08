const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema(
	{
		firstName: {
			type: String,
			required: true,
			minlength: 2,
		},
		lastName: {
			type: String,
			required: true,
			minlength: 2,
		},
		email: {
			type: String,
			required: true,
			trim: true,
			unique: true,
			minlength: 2,
		},
		password: {
			type: String,
			required: true,
			minlength: 6,
		},
		profilePic: {
			type: String,
			default:
				"https://res.cloudinary.com/dsc4fuhsm/image/upload/v1702227887/CollabMate/oscfgcfp0xnlj3nebpa4.jpg",
		},
		role: {
			type: String,
			enum: ["ADMIN", "TEAM LEADER", "EMPLOYEE"],
			default: "EMPLOYEE",
		},
		team: {
			type: Schema.Types.ObjectId,
			ref: "Team",
		},
	},
	{ timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
