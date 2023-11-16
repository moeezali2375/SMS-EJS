function due_date(date, days) {
	var result = new Date(date);
	result.setDate(result.getDate() + days);
	return result;
}

function calculate_bill(oldUnits, currentUnits, rate) {
	var result = parseFloat(currentUnits) - parseFloat(oldUnits);
	result = result * rate;
	return result;
}

module.exports = {
	due_date,
	calculate_bill,
};
