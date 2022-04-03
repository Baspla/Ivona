import { Composer } from 'telegraf';
import { groupFlags } from '../../../constants/groupFlags.js';
import { getAlias, getGroupKarmaOrdered } from '../../../data/data.js';
import { hasGroupFlags } from '../../predicates/HasGroupFlags.js';
import { errorHandler } from '../../utils/utils.js';

export const ehreCommand = Composer.optional(hasGroupFlags(groupFlags.feature.karma), Composer.command("top", (ctx) => {
	getGroupKarmaOrdered(ctx.chat.id).then((entries) => {
		let list = "Top Ehre:\n";
		Promise.allSettled(entries.map((entry) => {
			return getAlias(entry.value).then((alias) => {
				list += "<code>" + entry.score + " Ehre</code> - <a href=\"tg://user?id=" + entry.value + "\">" + alias + "</a>\n"
			})
		})).then(() => {
			ctx.reply(list, { parse_mode: "HTML", disable_notification: true });
		}, errorHandler)
	}, errorHandler)
}))
