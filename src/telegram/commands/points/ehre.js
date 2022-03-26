import db from '../../data/db.js';
import * as Location from '../utils/checks/location.js';
import * as GroupSetting from '../utils/checks/groupsetting.js';
import * as  constants from '../../constants.js';
export { setupEhre };

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