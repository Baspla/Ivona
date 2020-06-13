const justThings = require("../utils/justThingsImageGeneator");
const utils = require("../utils/utils");
const constants = require("../../constants");
const GroupSetting = require("../utils/checks/groupsetting");
exports.setupJustThings = setupJustThings;

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