const cookieParser = require("cookie-parser");
const { SECRET } = require("../config/index");

const cookieMiddleware = cookieParser(SECRET);

module.exports = cookieMiddleware;
