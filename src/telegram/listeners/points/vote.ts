import * as config from '../../../config';
import { Composer, Context, deunionize, Telegraf } from 'telegraf';
import { isOnSuperEhrenCooldown, groupExists, setSuperEhrenCooldown, incKarma, isOnEhrenCooldown, setEhrenCooldown, isOnEntehrenCooldown, setEntehrenCooldown, getAlias } from '../../../data/data';
import { Message } from 'telegraf/typings/core/types/typegram';
import { groupFlags } from '../../../constants/groupFlags';
import { hasGroupFlags } from '../../predicates/HasGroupFlags';
import { IsReply } from '../../predicates/IsReply';

const superEhrenHandler = (ctx: Context, next) => {
	const reply = (ctx.message as Message.TextMessage).reply_to_message;
	if (!reply.from.is_bot) {
		isOnSuperEhrenCooldown(ctx.from.id, ctx.chat.id).then((num) => {
			if (num == 0) {
				if (reply.from.id !== ctx.from.id) {
					setSuperEhrenCooldown(ctx.from.id, ctx.chat.id, config.cooldown.voteSuper);
					Promise.all([getAlias(ctx.from.id), getAlias(reply.from.id)]).then((values) => {
						ctx.reply("<a href=\"tg://user?id=" + ctx.from.id + "\">" + values[0] + "</a> ehrt <a href=\"tg://user?id=" + reply.from.id + "\">" + values[1] + "</a> absolut hart!", {
							parse_mode: "HTML",
							disable_notification: true
						})
						incKarma(reply.from.id, ctx.chat.id, 3);
					})
				}
			}
		})
	}
	next();
}

const ehrenHandler = (ctx: Context, next) => {
	const reply = (ctx.message as Message.TextMessage).reply_to_message;
	if (!reply.from.is_bot) {
		isOnEhrenCooldown(ctx.from.id, ctx.chat.id).then((num) => {
			if (num == 0) {
				if (reply.from.id !== ctx.from.id) {
					setEhrenCooldown(ctx.from.id, ctx.chat.id, config.cooldown.voteUp);
					Promise.all([getAlias(ctx.from.id), getAlias(reply.from.id)]).then((values) => {
						ctx.reply("<a href=\"tg://user?id=" + ctx.from.id + "\">" + values[0] + "</a> ehrt <a href=\"tg://user?id=" + reply.from.id + "\">" + values[1] + "</a>", {
							parse_mode: "HTML",
							disable_notification: true
						})
						incKarma(reply.from.id, ctx.chat.id, 1);
					})
				}
			}
		})
	}
	next();
}

const entehrenHandler = (ctx: Context, next) => {
	const reply = (ctx.message as Message.TextMessage).reply_to_message;
	if (!reply.from.is_bot) {
		isOnEntehrenCooldown(ctx.from.id, ctx.chat.id).then((num) => {
			if (num == 0) {
				if (reply.from.id !== ctx.from.id) {
					setEntehrenCooldown(ctx.from.id, ctx.chat.id, config.cooldown.voteUp);
					Promise.all([getAlias(ctx.from.id), getAlias(reply.from.id)]).then((values) => {
						ctx.reply("<a href=\"tg://user?id=" + ctx.from.id + "\">" + values[0] + "</a> entehrt <a href=\"tg://user?id=" + reply.from.id + "\">" + values[1] + "</a>", {
							parse_mode: "HTML",
							disable_notification: true
						})
						incKarma(reply.from.id, ctx.chat.id, -1);
					})
				}
			}
		})
	}
	next();
}

const superEhrenRegex = /^(\u2764\ufe0f|\ud83d\udc96|\ud83e\udde1|\ud83d\udc9b|\ud83d\udc9a|\ud83d\udc99|\ud83d\udc9c|\ud83d\udda4).*|.*(\u2764\ufe0f|\ud83d\udc96|\ud83e\udde1|\ud83d\udc9b|\ud83d\udc9a|\ud83d\udc99|\ud83d\udc9c|\ud83d\udda4)$/
const ehrenRegex = /^(\u002b|\u261d|\ud83d\udc46|\ud83d\udc4f|\ud83d\ude18|\ud83d\ude0d|\ud83d\udc4c|\ud83d\udc4d|\ud83d\ude38).*|.*(\u002b|\u261d|\ud83d\udc46|\ud83d\udc4f|\ud83d\ude18|\ud83d\ude0d|\ud83d\udc4c|\ud83d\udc4d|\ud83d\ude38)$/
const entehrenRegex = /^(\u2639\ufe0f|\ud83d\ude20|\ud83d\ude21|\ud83e\udd2c|\ud83e\udd2e|\ud83d\udca9|\ud83d\ude3e|\ud83d\udc4e|\ud83d\udc47).*|.*(\u2639\ufe0f|\ud83d\ude20|\ud83d\ude21|\ud83e\udd2c|\ud83e\udd2e|\ud83d\udca9|\ud83d\ude3e|\ud83d\udc4e|\ud83d\udc47)$/

export const VoteListener = Composer.optional(IsReply, Composer.optional(hasGroupFlags(groupFlags.feature.karma), Composer.hears(superEhrenRegex, superEhrenHandler), Composer.hears(ehrenRegex, ehrenHandler), Composer.hears(entehrenRegex, entehrenHandler)))