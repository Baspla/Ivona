const express = require("express");
const db = require("../../data/db.js");
let router = express.Router();
router.get("/auth", function (req, res) {
	res.render("index", {
		breadcrumbs: req.breadcrumbs()
	});
});
router.use((req, res, next) => {
	if (req.session.user !== undefined) {
		next();
	} else {
		res.status(401).json({error: "Sie sind nicht angemeldet"});
	}
});
router.use((req, res, next) => {
	res.status(404).json({error: "Unbekannter API Pfad"});
});
module.exports = router;