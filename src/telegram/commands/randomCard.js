const scry = require("scryfall-sdk");
const GroupSetting = require("../utils/checks/groupsetting");
const constants = require("../../constants");

exports.setupRandomCard = setupRandomCard;

function setupRandomCard(bot) {
	bot.command("randomCard",GroupSetting.isEnabled(constants.settings.features.magic), (ctx) => {
		scry.Cards.random().then(card => {
			ctx.reply("Hier ist eine zufällige Karte: <a href=\"" + card.image_uris.normal + "\">" + card.name + "</a>\n", {parse_mode: "HTML"});
		});
	});
}