const utils = require("../utils");

exports.User = (ctx, next) => {
    if (!utils.isUserChat(ctx.chat.type)) {
        ctx.reply("Das geht nur in Privatnachrichten");
    } else {
        next();
    }
};

exports.Group = (ctx, next) => {
    if (!utils.isGroupChat(ctx.chat.type)) {
        ctx.reply("Das geht nur in Gruppen");
    } else {
        next();
    }
};