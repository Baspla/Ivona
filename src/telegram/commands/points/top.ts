import * as constants from '../../../constants.js';
import { getAlias, getGroupPointsOrdered } from '../../../data/data.js';

export { setupTop };

function setupTop(bot) {
	bot.command("top", (ctx) => {
		getGroupPointsOrdered(ctx.chat.id).then((entries) => {
			let list = "Top Ehre:\n";
			Promise.allSettled(entries.map((entry) => {
				return getAlias(entry.value).then((alias) => {
					list += "<code>" + entry.score + " Ehre</code> - <a href=\"tg://user?id=" + entry.value + "\">" + alias + "</a>\n"
				})
			})).then(() => {
				ctx.reply(list, { parse_mode: "HTML", disable_notification: true });
			})
		})
	});
}
