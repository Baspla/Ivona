import { Composer } from 'telegraf';
import { groupFlags } from '../../../constants/groupFlags.js';
import { getAlias, getGroupPointsOrdered } from '../../../data/data.js';
import { hasGroupFlags } from '../../predicates/HasGroupFlags.js';
import { errorHandler, getLevelForPoints, getTargetForPoints, getTitleForPoints } from '../../utils/utils.js';

export const topCommand = Composer.optional(hasGroupFlags(groupFlags.feature.points), Composer.command("top", (ctx) => {
	getGroupPointsOrdered(ctx.chat.id).then((entries) => {
		let list = "Top Punkte:\n";
		Promise.allSettled(entries.map((entry) => {
			return getAlias(entry.value).then((alias) => {
				list += "<b>"+getTitleForPoints(entry.score) + "</b> - <a href=\"tg://user?id=" + entry.value + "\">" + alias + "</a> (" + entry.score + "/" + getTargetForPoints(entry.score) + ")\n"
			})
		})).then(() => {
			ctx.reply(list, { parse_mode: "HTML", disable_notification: true });
		},errorHandler)
	},errorHandler)
}))
