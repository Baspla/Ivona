require("../utils/utils");
const discord = require("../../discord/discordBot");
const Feature = require("../utils/checks/feature");
const features = require("../utils/features");

exports.setupQuote = setupQuote;

function setupQuote(bot) {
    bot.command("quote",Feature.hasFeature(features.quote), (ctx) => {
        const quote = discord.getRandomQuote();
        if (quote !== undefined) {
            ctx.reply(quote);
        }
    });
}