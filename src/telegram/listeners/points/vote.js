import * as utils from '../utils/utils.js';
import * as db from '../../data/db.js';
import * as GroupSetting from '../utils/checks/groupsetting.js';
import * as config from '../../config.js';
import * as constants from '../../constants.js';
export { setupVote };

function setupVote(bot) {
	// Super Ehren
	bot.hears(/^(\u2764\ufe0f|\ud83d\udc96|\ud83e\udde1|\ud83d\udc9b|\ud83d\udc9a|\ud83d\udc99|\ud83d\udc9c|\ud83d\udda4).*|.*(\u2764\ufe0f|\ud83d\udc96|\ud83e\udde1|\ud83d\udc9b|\ud83d\udc9a|\ud83d\udc99|\ud83d\udc9c|\ud83d\udda4)$/, (ctx, next) => {
		if (utils.isReply(ctx) && utils.isGroupChat(ctx.chat.type)) {
			if (!GroupSetting.isEnabled("features.karma")) return next();
			const ustats = db.getUserGroupByTGID(ctx.from.id, ctx.chat.id);
			if (ustats !== undefined) {
				if (ctx.message.reply_to_message.from !== undefined && !ctx.message.reply_to_message.from.is_bot) {
					const tostats = db.getUserGroupByTGID(ctx.message.reply_to_message.from.id, ctx.chat.id);
					if (tostats !== undefined) {
						if (ctx.message.reply_to_message.from.id !== ctx.from.id) {
							let now = new Date().getTime();
							if (now - ustats.lastSuper > config.cooldown.voteSuper) { //2 Stunden
								db.setUserGroupLastSuper(ustats.user.id, ustats.group.id, now);
								ctx.reply("<a href=\"tg://user?id=" + ustats.user.tgid + "\">" + ustats.user.name + "</a> ehrt <a href=\"tg://user?id=" + tostats.user.tgid + "\">" + tostats.user.name + "</a> absolut hart!", {
									parse_mode: "HTML",
									disable_notification: true
								});
								db.setUserGroupKarma(tostats.user.id, ustats.group.id, tostats.karma + 3);
							}
						}
					}
				}
			}
		}
		next();
	}
	);

	// Ehren
	bot.hears(/^(\u002b|\u261d|\ud83d\udc46|\ud83d\udc4f|\ud83d\ude18|\ud83d\ude0d|\ud83d\udc4c|\ud83d\udc4d|\ud83d\ude38).*|.*(\u002b|\u261d|\ud83d\udc46|\ud83d\udc4f|\ud83d\ude18|\ud83d\ude0d|\ud83d\udc4c|\ud83d\udc4d|\ud83d\ude38)$/, (ctx, next) => {
		if (utils.isReply(ctx) && utils.isGroupChat(ctx.chat.type)) {
			if (!GroupSetting.isEnabled("features.karma")) return next();
			const ustats = db.getUserGroupByTGID(ctx.from.id, ctx.chat.id);
			if (ustats !== undefined) {
				if (ctx.message.reply_to_message.from !== undefined && !ctx.message.reply_to_message.from.is_bot) {
					const tostats = db.getUserGroupByTGID(ctx.message.reply_to_message.from.id, ctx.chat.id);
					if (tostats !== undefined) {
						if (ctx.message.reply_to_message.from.id !== ctx.from.id) {
							let now = new Date().getTime();
							if (now - ustats.lastUp > config.cooldown.voteUp) { //5 Minuten
								db.setUserGroupLastUp(ustats.user.id, ustats.group.id, now);
								ctx.reply("<a href=\"tg://user?id=" + ustats.user.tgid + "\">" + ustats.user.name + "</a> ehrt <a href=\"tg://user?id=" + tostats.user.tgid + "\">" + tostats.user.name + "</a>.", {
									parse_mode: "HTML",
									disable_notification: true
								});
								db.setUserGroupKarma(tostats.user.id, ustats.group.id, tostats.karma + 1);
							}
						}
					}
				}
			}
		}
		next();
	});

	// Entehren
	bot.hears(/^(\u2639\ufe0f|\ud83d\ude20|\ud83d\ude21|\ud83e\udd2c|\ud83e\udd2e|\ud83d\udca9|\ud83d\ude3e|\ud83d\udc4e|\ud83d\udc47).*|.*(\u2639\ufe0f|\ud83d\ude20|\ud83d\ude21|\ud83e\udd2c|\ud83e\udd2e|\ud83d\udca9|\ud83d\ude3e|\ud83d\udc4e|\ud83d\udc47)$/, (ctx, next) => {
		if (utils.isReply(ctx) && utils.isGroupChat(ctx.chat.type)) {
			if (!GroupSetting.isEnabled(constants.settings.features.karma)) return next();
			const ustats = db.getUserGroupByTGID(ctx.from.id, ctx.chat.id);
			if (ustats !== undefined) {
				if (ctx.message.reply_to_message.from !== undefined && !ctx.message.reply_to_message.from.is_bot) {
					const tostats = db.getUserGroupByTGID(ctx.message.reply_to_message.from.id, ctx.chat.id);
					if (tostats !== undefined) {
						if (ctx.message.reply_to_message.from.id !== ctx.from.id) {
							let now = new Date().getTime();
							if (now - ustats.lastDown > config.cooldown.voteDown) { //10 Minuten
								db.setUserGroupLastDown(ustats.user.id, ustats.group.id, now);
								ctx.reply("<a href=\"tg://user?id=" + ustats.user.tgid + "\">" + ustats.user.name + "</a> entehrt <a href=\"tg://user?id=" + tostats.user.tgid + "\">" + tostats.user.name + "</a>.", {
									parse_mode: "HTML",
									disable_notification: true
								});
								db.setUserGroupKarma(tostats.user.id, ustats.group.id, tostats.karma - 1);
							}
						}
					}
				}
			}
		}
		next();
	});
}