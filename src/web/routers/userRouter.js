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
	req.breadcrumbs("Shop");
	res.render("user/shop/index", {
		breadcrumbs: req.breadcrumbs()
	});
});
router.get("/shop/:id", function (req, res) {
	req.breadcrumbs("Shop Entry");
	res.render("user/shop/shopEntry", {breadcrumbs: req.breadcrumbs(), shopEntryId: req.params.id});
});
router.get("/shop/confirm/:transaction", function (req, res) {
	req.breadcrumbs("Bestätigung");
	res.render("user/shop/bestaetigung", {breadcrumbs: req.breadcrumbs(), transactionId: req.params.transaction});
});
router.get("/gamble", function (req, res) {
	req.breadcrumbs("Gamble");
	res.render("user/gamble/index", {
		breadcrumbs: req.breadcrumbs()
	});
});
router.get("/gamble/roulette", function (req, res) {
	req.breadcrumbs("Roulette");
	res.render("user/gamble/roulette", {
		breadcrumbs: req.breadcrumbs()
	});
});
router.get("/magic", function (req, res) {
	req.breadcrumbs("Magic");
	res.render("user/magic/index", {
		breadcrumbs: req.breadcrumbs()
	});
});
router.get("/magic/decks", function (req, res) {
	req.breadcrumbs("Decks");
	let page = req.query.p;
	if (page === undefined) page = 1;
	res.render("user/magic/decks/index", {breadcrumbs: req.breadcrumbs(), page: page, lastPage: 5});
});
router.get("/magic/decks/:id", function (req, res) {
	req.breadcrumbs("Deck");
	res.render("user/magic/decks/deck", {breadcrumbs: req.breadcrumbs(), deckId: req.params.id});
});
router.get("/magic/decks/:id/edit", function (req, res) {
	req.breadcrumbs("Deck bearbeiten");
	res.render("user/magic/decks/deckBearbeiten", {breadcrumbs: req.breadcrumbs(), deckId: req.params.id});
});
router.get("/magic/decks/create", function (req, res) {
	req.breadcrumbs("Deck erstellen");
	res.render("user/magic/decks/deckErstellen", {
		breadcrumbs: req.breadcrumbs()
	});
});
router.get("/magic/matches", function (req, res) {
	req.breadcrumbs("Matches");
	res.render("user/magic/matches/index", {
		breadcrumbs: req.breadcrumbs()
	});
});
router.get("/magic/matches/:id", function (req, res) {
	req.breadcrumbs("Match");
	res.render("user/magic/matches/match", {breadcrumbs: req.breadcrumbs(), matchId: req.params.id});
});
router.get("/magic/matches/:id/edit", function (req, res) {
	req.breadcrumbs("Match bearbeiten");
	res.render("user/magic/matches/matchBearbeiten", {breadcrumbs: req.breadcrumbs(), matchId: req.params.id});
});
router.get("/magic/matches/create", function (req, res) {
	req.breadcrumbs("Match erstellen");
	res.render("user/magic/matches/matchErstellen", {
		breadcrumbs: req.breadcrumbs()
	});
});
module.exports = router;