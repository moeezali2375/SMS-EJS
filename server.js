const express = require("express");
const sessionMiddleware = require("./middlewares/session");
const corsMiddleware = require("./middlewares/cors");
const cookieMiddleware = require("./middlewares/cookie");
const passportMiddleware = require("./middlewares/passport");
const router = require("./routes/allroutes");
const { PORT } = require("./config/index");
const path = require("path");

require("./database/index").connect(); //! DB

var app = express();

//! ---------------MIDDLEWARES------------------
app.set("view engine", "ejs");
app.set("views", __dirname + "/views");
app.use(express.static(path.join(__dirname, "public")));

app.use(sessionMiddleware);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(corsMiddleware);

app.use(cookieMiddleware);

app.use(passportMiddleware.initialize);
app.use(passportMiddleware.session);

//! -----------------ROUTES---------------------
app.use("/", router);

//! ------------------APP-----------------------
app.listen(PORT, async () => {
	console.log("Server started on port: " + PORT);
});

// require("./Tests/paymentInsertions").insert();
// require("./Tests/bookingInsertions");
// require("./Tests/visitorInsertions").insert();
