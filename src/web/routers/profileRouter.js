const express = require("express");
const db = require("../../data/db.js");
let router = express.Router();
router.use(function (req,res,next) {
	req.breadcrumbs("Profil","/user/profil");
	next();
});
router.get("/", function (req, res) {
	res.render("user/profil/index", {
		breadcrumbs: req.breadcrumbs()
	});
});
router.get("/edit", function (req, res) {
	if (req.query.name !== undefined) {
		db.setUserName(req.session.user.id, req.query.name);
		req.session.user = db.getUser(req.session.user.id);
	}
	res.redirect("/user/profil");
});
router.get("/gruppen", function (req, res) {
	req.breadcrumbs("Gruppen","/user/profil/gruppen");
	let userGroups = db.getUserGroups(req.session.user.id);
	res.render("user/profil/gruppen/index", {breadcrumbs: req.breadcrumbs(), userGroups: userGroups});
});
router.get("/gruppen/:id", function (req, res) {
	req.breadcrumbs("Gruppe","/user/profil/gruppen");
	res.render("user/profil/gruppen/gruppe", {breadcrumbs: req.breadcrumbs(), groupId: req.params.id});
});
router.get("/gruppen/:id/edit", function (req, res) {
	req.breadcrumbs("Gruppe bearbeiten");
	res.render("user/profil/gruppen/gruppeBearbeiten", {breadcrumbs: req.breadcrumbs(), groupId: req.params.id});
});
router.get("/abzeichen", function (req, res) {
	req.breadcrumbs("Abzeichen");
	res.render("user/profil/abzeichen/index", {
		breadcrumbs: req.breadcrumbs()
	});
});
router.get("/abzeichen/:id", function (req, res) {
	req.breadcrumbs("Abzeichen");
	res.render("user/profil/abzeichen/abzeichen", {breadcrumbs: req.breadcrumbs(), abzeichenId: req.params.id});
});
router.get("/items", function (req, res) {
	req.breadcrumbs("Items");
	res.render("user/profil/items/index", {
		breadcrumbs: req.breadcrumbs()
	});
});
router.get("/items/:id", function (req, res) {
	req.breadcrumbs("Item");
	res.render("user/profil/items/item", {breadcrumbs: req.breadcrumbs(), itemId: req.params.id});
});
router.get("/transaktionen", function (req, res) {
	req.breadcrumbs("Transaktionen");
	res.render("user/profil/transaktionen", {
		breadcrumbs: req.breadcrumbs()
	});
});
module.exports = router;