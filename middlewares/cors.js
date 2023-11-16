const cors = require("cors");
const { CLIENT } = require("../config/index");

const corsOptions = {
	origin: CLIENT,
	credentials: true,
};

const corsMiddleware = cors(corsOptions);

module.exports = corsMiddleware;
