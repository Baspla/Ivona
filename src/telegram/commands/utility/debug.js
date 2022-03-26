import * as discordBot from '../../discord/discordBot.js';

export { setupDebug };

function setupDebug(bot) {
	bot.command("debug", (ctx) => {
		ctx.reply("Telegram Bot läuft\n" +
            //"Discord Bot läuft" + ((discordBot.isDisabled()) ? " nicht" : "") + "\n" +
            "Web API läuft");
	});
}