import { Composer } from "telegraf";
import { userFlags } from "../../../constants/userFlags";
import { getGroupPointsOrdered } from "../../../data/data";
import { hasUserFlags } from "../../predicates/HasUserFlags";

export const debugCommand = Composer.optional(hasUserFlags(userFlags.admin.debug), Composer.command("debug", (ctx) => {
	ctx.reply("Telegram Bot läuft");
	ctx.replyWithPhoto("timmorgner.de/moe/1.png");
	ctx.reply("Gruppe:"+ctx.chat.id+"| User:"+ctx.from.id);
}))