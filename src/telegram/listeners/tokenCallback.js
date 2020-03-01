const db = require("../../data/db");
const Location = require("../utils/LocationCheck");

exports.setupTokenCallback = setupTokenCallback;

function setupTokenCallback(bot) {
    //TODO Blockiert alle anderen Callback querys
    bot.on("callback_query", Location.User, ctx => {
        db.removeAllTokens(ctx.from.id);
        const token = db.insertToken(ctx.from.id);
        ctx.editMessageText("Dein neuer Token ist\n<code>" + token + "</code>", {
            parse_mode: "HTML",
            reply_markup: regenerateTokenKeyboard
        });
    });
}