const utils = require("./utils");
const discord = require("../discord/discordBot");

exports.init=init;

function init(bot) {

    discord.discordBotInit();

    bot.command("quote", (ctx,next) => {
        if (utils.isGroupChat(ctx.chat.type)) {
            ctx.reply(discord.getRandomQuote());
        }
        next();
    });

    bot.command("reload", (ctx,next) => {
        if(utils.isGroupChat(ctx.chat.type)){
            discord.reloadQuoteCache(ctx);
        }
        next();
    });
}