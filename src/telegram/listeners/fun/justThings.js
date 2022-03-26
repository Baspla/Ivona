import * as utils from '../../utils/utils.js';
import * as constants from '../../../constants.js';
export { setupJustThings };

function setupJustThings(bot) {
	bot.hears(/^((wenn)|(when))[ \n]/i, (ctx,next) => {
		if (utils.isGroupChat(ctx.chat.type)) {
			if (!GroupSetting.isEnabled(constants.settings.features.justThings)) return next();
			justThings.generateImage(ctx.message.text, ctx.from.first_name, () =>
				ctx.replyWithPhoto({source: "resources/justThings.png"}));
		}
		next();
	});
}