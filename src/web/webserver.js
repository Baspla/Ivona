const fs = require("fs");
const express = require("express");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const app = express();
const http = require("http");
const db = require("../data/db.js");
const crypto = require("crypto");
const config = require("../config");
const breadcrumbs = require("express-breadcrumbs");
const apiRouter = require("./routers/apiRouter");
const userRouter = require("./routers/userRouter");

let secret = crypto.createHash("sha256").update(process.env.BOT_TOKEN).digest();
let running = false;

exports.isRunning = function () {
	return running;
};

function checkTelegramLogin(data, secret) {
	data = JSON.parse(JSON.stringify(data));
	let input_hash = data.hash;
	delete data.hash;
	let array = [];
	for (let key in data) {
		if (data.hasOwnProperty(key))
			array.push(key + "=" + data[key]);
	}
	array = array.sort();
	let check_string = array.join("\n");
	let check_hash = crypto.createHmac("sha256", secret).update(check_string).digest("hex");
	if (check_hash === input_hash) {
		return data;
	} else {
		return false;
	}
}

app.set("view engine", "pug");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(breadcrumbs.init());
app.use(cookieParser());
if (config.web.sessionSecret === undefined) {
	console.warn("SESSION_SECRET NICHT GESETZT!");
}
app.use(session({
	secret: process.env.SESSION_SECRET,
	resave: true,
	saveUninitialized: false
}));
app.use(function (req, res, next) {
	res.locals.session = req.session;
	next();
});
app.use(breadcrumbs.setHome());
app.use("/stylesheets", express.static("web_files/stylesheets"));
app.use("/static/bootstrap", express.static("node_modules/bootstrap/dist/"));
app.use("/static/popper.js", express.static("node_modules/popper.js/dist/"));
app.use("/static/jquery", express.static("node_modules/jquery/dist/"));
app.use("/js", express.static("web_files/js"));
app.use("/sitemap.xml", express.static("web_files/sitemap.xml"));
app.use("/api", apiRouter);
app.use("/user",userRouter);
app.get("/", function (req, res) {
	let notification;
	if (req.query.loggedOut === "1") notification = "Du wurdest erfolgreich abgemeldet.";
	res.render("index", {breadcrumbs: req.breadcrumbs(), notification: notification});
});
app.get("/impressum", function (req, res) {
	req.breadcrumbs("Impressum");
	res.render("impressum", {
		breadcrumbs: req.breadcrumbs()
	});
});
app.get("/befehle", function (req, res) {
	req.breadcrumbs("Befehle");
	res.render("befehle", {
		breadcrumbs: req.breadcrumbs()
	});
});
app.get("/login", function (req, res) {
	req.breadcrumbs("Login");
	res.render("login", {
		breadcrumbs: req.breadcrumbs()
	});
});
app.get("/logout", function (req, res) {
	if (req.session.user !== undefined) {
		delete req.session.user;
		res.redirect("/?loggedOut=1");
	} else {
		res.redirect("/");
	}
});
app.get("/telegram", function (req, res) {
	let data;
	if (req.query.debugId !== undefined) {
		data = {id: req.query.debugId};
	} else {
		data = checkTelegramLogin(req.query, secret);
	}
	if (data !== false) {
		let user = db.getUserByTGID(data.id);
		if (user === undefined) {
			res.redirect("/login"); //unbekannter nutzer
		} else {
			req.session.user = user;
			res.redirect("/user");
		}
	} else
		res.redirect("/login"); //Login Fehler
});
app.use(function (req, res) {
	res.status(404).render("error", {
		breadcrumbs: req.breadcrumbs(),
		error: {status: 404},
		message: "Seite konnte nicht gefunden werden"
	});
});
const webserver = http.createServer(app).on("close", () => running = false).listen(config.web.ports.https, function () {
	running = true;
	let host = webserver.address().address;
	const port = webserver.address().port;
	if (host === "::") host = "localhost";
	console.info("Webserver listening at https://" + host + ":" + port);
});