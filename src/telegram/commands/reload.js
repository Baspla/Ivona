const utils = require("../utils/utils");
const discord = require("../../discord/discordBot");

exports.setupReload=setupReload;

function setupReload(bot) {

    bot.command("reload", (ctx,next) => {
        if(utils.isGroupChat(ctx.chat.type)){
            discord.reloadQuoteCache(ctx);
        }
        next();
    });
}