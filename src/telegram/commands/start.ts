import { Composer, Context, Telegraf } from "telegraf";

export { setupStart };
function setupStart(bot:Telegraf) {
	bot.start(Composer.privateChat(
		(ctx: Context) => ctx.reply("Hi, Ich bin Ivona.\nIch bin hier um dir zu Helfen."))
	);
}