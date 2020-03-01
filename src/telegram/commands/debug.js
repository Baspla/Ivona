const discordBot = require("../../discord/discordBot");

exports.setupDebug = setupDebug;

function setupDebug(bot) {
    bot.command('debug', (ctx) => {
        ctx.reply("Telegram Bot läuft\n" +
            "Discord Bot läuft" + ((discordBot.isDisabled()) ? " nicht" : "") + "\n" +
            "Web API läuft");
    });
}