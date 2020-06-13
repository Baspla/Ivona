const db = require("../../data/db");
const Location = require("../utils/checks/location");
const GroupSetting = require("../utils/checks/groupsetting");
const constants = require("../../constants");

exports.setupTop = setupTop;

function setupTop(bot) {
	bot.command("top",GroupSetting.isEnabled(constants.settings.features.points),Location.Group, (ctx) => {
		let rows = db.getUserGroupsOrderedByTGIDByPoints(ctx.chat.id,10,0);
		let list = "Top Punkte:\n";
		rows.forEach(v => {
			list += "<code>" + v.level + "</code> <b>" + v.titel + "</b> <a href=\"tg://user?id=" + v.user.tgid + "\">" + v.user.name + "</a> (" + v.points + "/" + v.levelZiel + ")\n";
		});
		ctx.reply(list, {parse_mode: "HTML",disable_notification:true});
	});
}
