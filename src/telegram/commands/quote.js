const utils = require("../utils/utils");
const discord = require("../../discord/discordBot");

exports.setupQuote = setupQuote;

function setupQuote(bot) {
    bot.command("quote", (ctx, next) => {
        if (utils.isGroupChat(ctx.chat.type)) {
            const quote = discord.getRandomQuote();
            if (quote !== undefined) {
                ctx.reply(quote);
            }
        }
        next();
    });
}