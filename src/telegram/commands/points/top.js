import * as db from '../../data/db.js';
import * as Location from '../utils/checks/location.js';
import * as GroupSetting from '../utils/checks/groupsetting.js';
import * as constants from '../../constants.js';

export { setupTop };

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
