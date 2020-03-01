const utils = require("../utils/utils");
const discord = require("../../discord/discordBot");

exports.setupQuote = setupQuote;

function setupQuote(bot) {
    bot.command("quote", (ctx) => {
        const quote = discord.getRandomQuote();
        if (quote !== undefined) {
            ctx.reply(quote);
        }
    });
}