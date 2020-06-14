const fs = require("fs");
const express = require("express");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const app = express();
const https = require("https");
const http = require("http");
const db = require("../data/db.js");
const crypto = require("crypto");

let secret = crypto.createHash("sha256").update(process.env.BOT_TOKEN).digest();
let running = false;
let apiRouter = express.Router();
let userRouter = express.Router();

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
app.use(cookieParser());
if (process.env.SESSION_SECRET === undefined) {
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
app.use("/stylesheets", express.static("stylesheets"));
app.use("/static", express.static("node_modules/bootstrap/dist/"));
apiRouter.get("/auth", function (req, res) {
	res.render("index");
});
apiRouter.use((req, res, next) => {
	if (req.session.user !== undefined) {
		next();
	} else {
		res.status(401).json({error: "Sie sind nicht angemeldet"});
	}
});
apiRouter.use((req, res, next) => {
	res.status(404).json({error: "Unbekannter API Pfad"});
});
app.use("/api", apiRouter);
userRouter.use((req, res, next) => {
	if (req.session.user !== undefined) {
		next();
	} else {
		res.redirect("/loginMissing");
	}
});
userRouter.get("/", function (req, res) {
	res.render("dashboard");
});
userRouter.get("/gamble", function (req, res) {
	res.render("gamble");
});
userRouter.get("/profil", function (req, res) {
	if (req.query.name !== undefined) {
		db.setUserName(req.session.user.id, req.query.name);
		req.session.user = db.getUser(req.session.user.id);
		res.redirect("profil");
	} else
		res.render("profil");
});
userRouter.get("/gruppen", function (req, res) {
	let userGroups = db.getUserGroups(req.session.user.id);
	res.render("gruppen", {userGroups: userGroups});
});
userRouter.get("/abzeichen", function (req, res) {
	res.render("abzeichen");
});
userRouter.get("/magic", function (req, res) {
	res.render("magic");
});
userRouter.get("/magic/decks", function (req, res) {
	let page = req.query.p;
	if (page === undefined) page = 1;
	res.render("mtgDecks", {page: page, lastPage: 5});
});
userRouter.get("/magic/matches", function (req, res) {
	res.render("mtgMatches");
});
userRouter.get("/shop", function (req, res) {
	res.render("shop");
});
userRouter.get("/test", function (req, res) {
	res.render("test");
	//TODO TEST REMOVE
});
userRouter.get("/logout", function (req, res) {
	if (req.session.user !== undefined) {
		delete req.session.user;
		res.redirect("/?loggedOut=1");
	}
});
app.use("/user", userRouter);
app.get("/", function (req, res) {
	let notification;
	if (req.query.loggedOut === "1") notification = "Du wurdest erfolgreich abgemeldet.";
	res.render("index", {notification: notification});
});
app.get("/loginUnknown", function (req, res) {
	res.render("loginError", {message: "Auf das Web Interface kann nur von Nutzern zugegriffen werden"});
});
app.get("/loginError", function (req, res) {
	res.render("loginError", {message: "Falsche Antwort von Telegram erhalten"});
});
app.get("/loginMissing", function (req, res) {
	res.render("loginError", {message: "Sie sind nicht angemeldet"});
});
app.get("/impressum", function (req, res) {
	res.render("impressum");
});
app.get("/befehle", function (req, res) {
	res.render("befehle");
});
app.get("/login", function (req, res) {
	let data;
	if (req.query.debugId !== undefined) {
		data = {id: req.query.debugId};
	} else {
		data = checkTelegramLogin(req.query, secret);
	}
	if (data !== false) {
		let user = db.getUserByTGID(data.id);
		if (user === undefined) {
			res.redirect("/loginUnknown");
		} else {
			req.session.user = user;
			res.redirect("/user");
		}
	} else
		res.redirect("/loginError");
});
app.use(function (req, res) {
	res.status(404).render("error", {error: {status: 404}, message: "Seite konnte nicht gefunden werden"});
});

const webserver = https.createServer({
	key: fs.readFileSync("./key.pem"),
	cert: fs.readFileSync("./cert.pem")
}, app).on("close", () => running = false).listen(process.env.HTTPS_PORT, function () {
	running = true;
	let host = webserver.address().address;
	const port = webserver.address().port;
	if (host === "::") host = "localhost";
	console.info("Webserver listening at https://" + host + ":" + port);
});

http.createServer(function (req, res) {
	res.writeHead(301, {"Location": "https://" + req.headers["host"] + req.url});
	res.end();
}).listen(process.env.HTTP_PORT);