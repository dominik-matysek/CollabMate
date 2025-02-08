const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const logSchema = new Schema(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        action: {
            type: String,
            required: true,
            enum: ["LOGIN_SUCCESS", "LOGIN_FAILURE", "LOGOUT", "REGISTER"]
        },
        ipAddress: {
            type: String,
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model("Log", logSchema);