import * as  constants from '../../../constants.js';
import { getAlias, getGroupKarmaOrdered } from '../../../data/data.js';
export { setupEhre };

function setupEhre(bot) {
	bot.command("ehre", (ctx) => {
		getGroupKarmaOrdered(ctx.chat.id).then((entries) => {
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