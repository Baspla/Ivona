

export { setupDebug };

function setupDebug(bot) {
	bot.command("debug", (ctx) => {
		ctx.reply("Telegram Bot läuft");
	});
}