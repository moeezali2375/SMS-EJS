const House = require("../models/house");

const array = [
	{
		houseNo: 1,
		block: "A",
	},
	{
		houseNo: 2,
		block: "A",
	},
	{
		houseNo: 3,
		block: "A",
	},
	{
		houseNo: 4,
		block: "A",
	},
	{
		houseNo: 5,
		block: "A",
	},
	{
		houseNo: 1,
		block: "B",
	},
	{
		houseNo: 2,
		block: "B",
	},
	{
		houseNo: 3,
		block: "B",
	},
	{
		houseNo: 4,
		block: "B",
	},
	{
		houseNo: 5,
		block: "B",
	},
];
House.insertMany(array)
	.then((res) => {
		console.log(res[0]);
	})
	.catch((err) => {
		console.log(err);
	});
