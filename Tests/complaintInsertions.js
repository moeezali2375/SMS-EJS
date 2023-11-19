const Complaint = require("../models/complaint");

module.exports.insert = async () => {
	await Complaint.insertMany([
		{
			residentId: "6534162c1022a0d29081b035",
			title: "Bijlee nahi andi pnl",
			description: "Kya description dun bijlee nahi andi or ki",
			date: new Date(),
			isSolved: 0,
		},
		{
			residentId: "6534162c1022a0d29081b035",
			title: "Gas wi nahi andi pnl",
			description: "Raat ko khana khana hota hai or gas bc gayi hoti hai",
			date: new Date(),
			isSolved: 0,
		},
		{
			residentId: "653416071022a0d29081b026",
			title: "Dollar expensive",
			description: "Ahtmatya krnay ka samay a gya hai!",
			date: new Date(),
			isSolved: 0,
		},
	]);
};
