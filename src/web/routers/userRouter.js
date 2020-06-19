const express = require("express");
const breadcrumbs = require("express-breadcrumbs");
const db = require("../../data/db.js");
const profilRouter = require("./profileRouter");
let router = express.Router();
router.use("/", breadcrumbs.setHome({
	name: "User",
	url: "/user"
}));
router.use((req, res, next) => {
	if (req.session.user !== undefined) {
		next();
	} else {
		res.redirect("/login");
	}
});
router.get("/", function (req, res) {
	res.render("user/index", {
		breadcrumbs: req.breadcrumbs()
	});
});
router.use("/profil", profilRouter);
router.get("/shop", function (req, res) {
	req.breadcrumbs("Shop", "/user/shop");
	res.render("user/shop/index", {
		breadcrumbs: req.breadcrumbs()
	});
});
router.get("/shop/:id", function (req, res) {
	req.breadcrumbs("Shop Entry", "/user/shop/" + req.params.id);
	res.render("user/shop/shopEntry", {breadcrumbs: req.breadcrumbs(), shopEntryId: req.params.id});
});
router.get("/shop/confirm/:transaction", function (req, res) {
	req.breadcrumbs("Bestätigung", "/user/shop/confirm/" + req.params.transaction);
	res.render("user/shop/bestaetigung", {breadcrumbs: req.breadcrumbs(), transactionId: req.params.transaction});
});
router.get("/gamble", function (req, res) {
	req.breadcrumbs("Gamble", "/user/gamble");
	res.render("user/gamble/index", {
		breadcrumbs: req.breadcrumbs()
	});
});
router.get("/gamble/roulette", function (req, res) {
	req.breadcrumbs("Roulette", "/user/gamble/roulette");
	res.render("user/gamble/roulette", {
		breadcrumbs: req.breadcrumbs()
	});
});
router.get("/magic", function (req, res) {
	req.breadcrumbs("Magic", "/user/magic");
	res.render("user/magic/index", {
		breadcrumbs: req.breadcrumbs()
	});
});
router.get("/magic/decks", function (req, res) {
	req.breadcrumbs("Magic", "/user/magic");
	req.breadcrumbs("Decks", "/user/magic/decks");
	let decks = db.getDecksByUser(req.session.user.id);
	res.render("user/magic/decks/index", {breadcrumbs: req.breadcrumbs(), decks: decks});
});
router.get("/magic/decks/:id", function (req, res) {
	req.breadcrumbs("Magic", "/user/magic");
	req.breadcrumbs("Decks", "/user/magic/decks");
	req.breadcrumbs("Deck", "/user/magic/decks/" + req.params.id);
	res.render("user/magic/decks/deck", {breadcrumbs: req.breadcrumbs(), deckId: req.params.id});
});
router.get("/magic/decks/:id/edit", function (req, res) {
	req.breadcrumbs("Deck bearbeiten");
	res.render("user/magic/decks/deckBearbeiten", {breadcrumbs: req.breadcrumbs(), deckId: req.params.id});
});
router.post("/magic/decks/create", function (req, res) {
	if (req.body.titel !== undefined && req.body.type !== undefined) {
		if (req.body.type === "commander" || req.body.type === "standard") {
			let desc = req.body.desc;
			if (desc === undefined) desc = "";
			db.createDeck(req.body.titel, req.session.user.id, desc, req.body.type);
		}
	}
	res.redirect("/user/magic/decks");
});
router.get("/magic/matches", function (req, res) {
	req.breadcrumbs("Magic", "/user/magic");
	req.breadcrumbs("Matches", "/user/magic/matches");
	let matches = db.getMatches();
	res.render("user/magic/matches/index", {
		breadcrumbs: req.breadcrumbs(),
		matches: matches
	});
});
router.post("/magic/matches/create", function (req, res) {
	if (req.body.titel !== undefined && req.body.type !== undefined) {
		if (req.body.type === "commander" || req.body.type === "standard") {
			db.createMatch(req.body.titel, req.body.type);
		}
	}
	res.redirect("/user/magic/matches");
});
router.post("/magic/matches/:id/edit", function (req, res) {
	if (req.body.titel !== undefined && req.body.type !== undefined) {
		db.editMatch(req.params.id, req.body.titel, req.body.type);
	}
	res.redirect("/user/magic/matches/" + req.params.id);
});
router.post("/magic/matches/:id/add", function (req, res) {
	if (req.body.user !== undefined && req.body.deck !== undefined && req.body.place !== undefined) {
		try {
			db.createUserMatch(req.body.user, req.params.id, req.body.deck, req.body.place);
		}catch (e){
			console.error(e);
		};
	}
	res.redirect("/user/magic/matches/" + req.params.id);
});
router.get("/magic/matches/:id", function (req, res) {
	req.breadcrumbs("Magic", "/user/magic");
	req.breadcrumbs("Matches", "/user/magic/matches");
	req.breadcrumbs("Match", "/user/magic/matches/" + req.params.id);
	let match = db.getMatch(req.params.id);
	let users = db.getUsers();
	let decks = db.getDecksByType(match.type);
	// noinspection PointlessBooleanExpressionJS
	if (match == null){
		res.render("user/magic/matches/unknownMatch",{breadcrumbs:req.breadcrumbs()});
	} else {
		let userMatches = db.getUserMatchesByMatch(req.params.id);
		res.render("user/magic/matches/match", {
			breadcrumbs: req.breadcrumbs(),
			match: match,
			userMatches: userMatches,
			users:users,
			decks:decks
		});
	}
});
module.exports = router;