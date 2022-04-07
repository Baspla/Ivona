import * as config from '../../../config.js';
import * as constants from '../../../constants/constants.js';
import { getAlias, groupExists, incKarma, incPoints, isOnEntehrenCooldown, setRewardCooldown } from '../../../data/data.js';
import { groupFlags } from '../../../constants/groupFlags.js';
import { Composer } from 'telegraf';
import { hasGroupFlags } from '../../predicates/HasGroupFlags.js';
import { errorHandler } from '../../utils/utils.js';

export const PointListener = Composer.optional(hasGroupFlags(groupFlags.feature.points), Composer.on("message", (ctx, next) => {
	isOnEntehrenCooldown(ctx.from.id, ctx.chat.id).then((num) => {
		if (num == 0) {
			setRewardCooldown(ctx.from.id, ctx.chat.id, config.cooldown.reward).then(() => {
				incPoints(ctx.from.id, ctx.chat.id, 3).then((value: number) => {

					
					// TODO Level Up Ersetzen
					
					let now = 0;
					for (let i = 0; i < constants.levels.length; i++) {
						if (value >= constants.levels[i]) now = i;
					}
					if (value - 3 < constants.levels[now]) {
						//getAlias(ctx.from.id).then((alias) =>
						//ctx.replyWithPhoto("timmorgner.de/moe/" + now + ".png", { caption: alias + " ist jetzt Level " + now }))l
					}
					
					// TODO Level Up Ersetzen
					
				}, errorHandler)
			}, errorHandler)
		}
	}, errorHandler)
	next();
}));