const utils = require("../utils");
const db = require("../../../data/db");
const constants = require("../../../constants");
exports.isEnabled = (settingName) => {
	return (ctx, next) => {
		if (ctx.chat != null) {
			if (utils.isGroupChat(ctx.chat.type)) {
				const gs = db.getGroupSettingByTGID(ctx.chat.id, settingName);
				if (gs == null) {
					console.debug("Gruppe hat die Eistellung",settingName,"nicht.");
					return;
				}
				if (gs.value !== constants.boolean.true) {
					console.debug("Gruppe hat die Eistellung",settingName,"nicht aktiviert.");
					return;
				}
			}
		}
		return next();
	};
};