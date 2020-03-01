const db = require("../../data/db");
const Markup = require("telegraf/markup");
const Auth = require("../utils/AuthenticationCheck");
const Location = require("../utils/LocationCheck");

exports.setupToken = setupToken;

const regenerateTokenKeyboard = Markup.inlineKeyboard([
    Markup.callbackButton('Regenerate Token', 'regenerateToken')
])

function setupToken(bot) {
    bot.command('token', Auth.roleRequired("user"), Location.User, (ctx) => {
        const tokens = db.getTokens(ctx.from.id);
        if (Array.isArray(tokens) && tokens.length) {
            let text = "Deine Tokens sind";
            tokens.forEach((v) => {
                text += "\n<code>" + v.token_text + "</code>";
            });
            ctx.reply(text, {parse_mode: "HTML", reply_markup: regenerateTokenKeyboard});
        } else {
            ctx.reply("Du hast noch keinen API Token", {reply_markup: regenerateTokenKeyboard});
        }
    });
}