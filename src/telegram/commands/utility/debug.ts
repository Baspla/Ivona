import { Composer } from "telegraf";
import { userFlags } from "../../../constants/userFlags";
import { hasUserFlags } from "../../predicates/HasUserFlags";


export { setupDebug };

function setupDebug(bot) {
	Composer.optional(hasUserFlags(userFlags.admin.debug),bot.command("debug", (ctx) => {
		ctx.reply("Telegram Bot läuft");
	}));
}