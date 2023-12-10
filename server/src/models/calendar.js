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
    timeStart: {
      type: Date,
      required: true,
    },
    timeEnd: {
      type: Date,
      required: true,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    participants: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    // reminder: {
    //   type: Number, // Represents the time in minutes before the event
    // },
  },
  { timestamps: true }
);

const calendarSchema = new Schema({
  team: {
    type: Schema.Types.ObjectId,
    ref: "Team",
    required: true,
  },
  events: [eventSchema],
});

module.exports = mongoose.model("Calendar", calendarSchema);
