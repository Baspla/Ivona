const db = require("../../data/db");
const Location = require("../utils/checks/location");
const GroupSetting = require("../utils/checks/groupsetting");
const constants = require("../../constants");
exports.setupEhre = setupEhre;

function setupEhre(bot) {
	bot.command("ehre",GroupSetting.isEnabled(constants.settings.features.karma),Location.Group, (ctx) => {
		let rows = db.getUsersOrderedByTGIDByKarma(ctx.chat.id,10,0);
		let list = "Top Ehre:\n";
		rows.forEach(v => {
			list += "<code>" + v.karma + " Ehre</code> - <a href=\"tg://user?id=" + v.user.tgid + "\">" + v.user.name + "</a>\n";
		});
		ctx.reply(list, {parse_mode: "HTML",disable_notification:true});
	});
}