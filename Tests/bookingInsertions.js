const Booking = require("../models/booking");

(async () => {
	try {
		const booking1 = new Booking({
			residentId: "6534162c1022a0d29081b035",
			location: "park",
			startTime: new Date("2023-01-01T16:00:00Z"),
			endTime: new Date("2023-01-01T18:00:00Z"),
		});
		await booking1.save();
		console.log("Booking 1 saved successfully");

		const booking2 = new Booking({
			residentId: "653416071022a0d29081b026",
			location: "park",
			startTime: new Date("2023-01-01T17:00:00Z"),
			endTime: new Date("2023-01-01T18:00:00Z"),
		});
		await booking2.save();
		console.log("This should not be reached");
	} catch (error) {
		console.error("Booking failed:", error.message);
	}
})();
