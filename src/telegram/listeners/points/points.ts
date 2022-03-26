
import utils from '../../utils/utils.js';
import * as config from '../../../config.js';
import * as constants from '../../../constants.js';
export { setupPoints };

function setupPoints(bot) {
	/*bot.use((ctx, next) => {
		if (ctx.chat !== undefined) {
			if (utils.isGroupChat(ctx.chat.type)) {
				if (!GroupSetting.isEnabled(constants.settings.features.points)) return next();
				const ug = db.getUserGroupByTGID(ctx.from.id, ctx.chat.id);
				if (ug != null) {
					let now = new Date().getTime();
					if (now - ug.lastReward > config.cooldown.reward) { //3 Minuten
						db.setUserGroupLastReward(ug.user.id, ug.group.id, now);
						db.setUserGroupPoints(ug.user.id, ug.group.id, ug.points + Math.floor(Math.random() * 12) + 1);
						utils.checkLevelUp(ctx,ug);
						db.addMoney(ug.user.id,config.chatReward,constants.transaction.reward,null);
					}
				}
			}
		}
		next();
	});*/
}