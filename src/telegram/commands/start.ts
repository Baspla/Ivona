import { Context, Telegraf } from "telegraf";
import { checkChatContext } from "../utils/checks/context";

export { setupStart };
function setupStart(bot:Telegraf) {
	bot.start(checkChatContext("private"),
		(ctx: Context) => ctx.reply("Hi, Ich bin Ivona.\nIch bin hier um dir zu Helfen.")
	);
}