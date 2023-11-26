const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
	residentId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "residents",
		required: true,
	},
	location: {
		type: String,
		enum: ["park", "hall", "pool"],
		required: true,
	},
	startTime: {
		type: Date,
		required: true,
	},
	endTime: {
		type: Date,
		required: true,
	},
	isVerified: {
		type: Boolean,
		default: false,
	},
});

bookingSchema.pre("save", async function (next) {
	const booking = this;
	try {
		// Check if there are any overlapping bookings for the same location and time
		const overlappingBooking = await Booking.findOne({
			location: booking.location,
			$or: [
				{
					startTime: { $lt: booking.endTime },
					endTime: { $gt: booking.startTime },
				},
			],
		});

		if (overlappingBooking) {
			const errorMessage =
				"Overlapping booking found for the same location and time";
			return next(new Error(errorMessage));
		}

		next();
	} catch (error) {
		return next(error);
	}
});

const Booking = mongoose.model("bookings", bookingSchema);

module.exports = Booking;
