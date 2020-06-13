const db = require("../../data/db");
module.exports = {
	isGroupChat(type) {
		return type === "group" || type === "supergroup";
	}, isUserChat(type) {
		return type === "private";
	},
	isCreator(id) {
		return id === 67025299;
	},
	isReply(ctx) {
		if (ctx.message.reply_to_message !== undefined) {
			return ctx.message.reply_to_message.from !== undefined;
		}
		return false;
	},
	checkLevelUp(ctx, ug) {
		const newug = db.getUserGroup(ug.user.id,ug.group.id);
		if (newug != null) {
			let levelNow = newug.level;
			let levelPrev = ug.level;
			let dist = levelNow - levelPrev;
			if (dist === 1) {
				ctx.replyWithPhoto("smug.moe/smg/" + levelNow + ".png", {caption: newug.name + " ist jetzt ein " + newug.titel});
			} else if (dist > 1) {
				ctx.replyWithPhoto("smug.moe/smg/" + levelNow + ".png", {caption: newug.name + " ist jetzt ein " + newug.titel + " und hat " + (dist - 1) + " Level übersprungen"});
			}
		}
	}
};