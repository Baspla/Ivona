const db = require("../../data/db");
const Markup = require("telegraf/markup");
const Auth = require("../utils/checks/authentication");
const Location = require("../utils/checks/location");

exports.setupToken = setupToken;

const regenerateTokenKeyboard = Markup.inlineKeyboard([
    Markup.callbackButton('Regenerate Token', 'regenerateToken')
]);

function setupToken(bot) {
    bot.command('token', Auth.roleRequired("user"), Location.User, (ctx) => {
        const tokens = db.getTokensByUser(db.getUserByTGID(ctx.from.id).id);
        if (Array.isArray(tokens) && tokens.length) {
            let text = "Deine Tokens sind";
            tokens.forEach((v) => {
                text += "\n<code>" + v.text + "</code>";
            });
            ctx.reply(text, {parse_mode: "HTML", reply_markup: regenerateTokenKeyboard});
        } else {
            ctx.reply("Du hast noch keinen API Token", {reply_markup: regenerateTokenKeyboard});
        }
    });
}