const scry = require("scryfall-sdk");
const db = require("../../data/db");
const GroupSettings = require("../utils/checks/groupsetting");
const constants = require("../../constants");
exports.dailyCard = dailyCard;

function dailyCard(bot) {

	scry.Cards.random().then(card => {
		db.getGroups().forEach((g) => {
			if (GroupSettings.isEnabled(constants.settings.features.magicDaily))
				bot.telegram.sendMessage(g.tgid, "Die Karte des Tages ist: <a href=\"" + card.image_uris.normal + "\">" + card.name + "</a>\n", {parse_mode: "HTML"});
		});
	}
	);
}
