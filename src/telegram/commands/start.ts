export { setupStart };
import { Context } from "telegraf"
let c = new Context();
function setupStart(bot) {
	bot.start(
		/**
		 * @typedef {import("telegraf").Context} Context
		 * @param {Context} ctx
		 */
		(ctx) => ctx.reply("Hi, Ich bin Ivona.\nIch bin hier um dir zu Helfen.")
	);
}