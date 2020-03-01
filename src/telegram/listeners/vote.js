const utils = require("../utils/utils");
const db = require("../../data/db");
exports.setupVote = setupVote;

function setupVote(bot) {
    // Super Ehren
    bot.hears(/^(\u2764\ufe0f|\ud83d\udc96|\ud83e\udde1|\ud83d\udc9b|\ud83d\udc9a|\ud83d\udc99|\ud83d\udc9c|\ud83d\udda4).*|.*(\u2764\ufe0f|\ud83d\udc96|\ud83e\udde1|\ud83d\udc9b|\ud83d\udc9a|\ud83d\udc99|\ud83d\udc9c|\ud83d\udda4)$/, (ctx, next) => {
        if (utils.isReply(ctx) && utils.isGroupChat(ctx.chat.type)) {
            if (ctx.message.reply_to_message.from !== undefined && !ctx.message.reply_to_message.from.is_bot) {
                if (ctx.message.reply_to_message.from.id !== ctx.from.id) {
                    db.insertUserIfNotExists(ctx.message.reply_to_message.from, 0, 0);
                    let now = new Date();
                    if (now.getTime() - bot.userMemMap[ctx.from.id].lastSuper.getTime() > 7200000) { //2 Stunden
                        bot.userMemMap[ctx.from.id].lastSuper = now;
                        ctx.reply(db.getUser(ctx.from.id).user_name + " ehrt " + db.getUser(ctx.message.reply_to_message.from.id).user_name + " absolut hart!");
                        db.addKarma(ctx.message.reply_to_message.from.id, 3);
                    }
                }
            }
        }
        next();
    });

    // Ehren
    bot.hears(/^(\u002b|\u261d|\ud83d\udc46|\ud83d\udc4f|\ud83d\ude18|\ud83d\ude0d|\ud83d\udc4c|\ud83d\udc4d|\ud83d\ude38).*|.*(\u002b|\u261d|\ud83d\udc46|\ud83d\udc4f|\ud83d\ude18|\ud83d\ude0d|\ud83d\udc4c|\ud83d\udc4d|\ud83d\ude38)$/, (ctx, next) => {
        if (utils.isReply(ctx) && utils.isGroupChat(ctx.chat.type)) {
            if (ctx.message.reply_to_message.from !== undefined && !ctx.message.reply_to_message.from.is_bot) {
                if (ctx.message.reply_to_message.from.id !== ctx.from.id) {
                    db.insertUserIfNotExists(ctx.message.reply_to_message.from, 0, 0);
                    let now = new Date();
                    if (now.getTime() - bot.userMemMap[ctx.from.id].lastUp.getTime() > 300000) { //5 Minuten
                        bot.userMemMap[ctx.from.id].lastUp = now;
                        ctx.reply(db.getUser(ctx.from.id).user_name + " ehrt " + db.getUser(ctx.message.reply_to_message.from.id).user_name);
                        db.addKarma(ctx.message.reply_to_message.from.id, 1);
                    }
                }
            }
        }
        next();
    });

    // Entehren
    bot.hears(/^(\u2639\ufe0f|\ud83d\ude20|\ud83d\ude21|\ud83e\udd2c|\ud83e\udd2e|\ud83d\udca9|\ud83d\ude3e|\ud83d\udc4e|\ud83d\udc47).*|.*(\u2639\ufe0f|\ud83d\ude20|\ud83d\ude21|\ud83e\udd2c|\ud83e\udd2e|\ud83d\udca9|\ud83d\ude3e|\ud83d\udc4e|\ud83d\udc47)$/, (ctx, next) => {
        if (utils.isReply(ctx) && utils.isGroupChat(ctx.chat.type)) {
            if (ctx.message.reply_to_message.from !== undefined && !ctx.message.reply_to_message.from.is_bot) {
                if (ctx.message.reply_to_message.from.id !== ctx.from.id) {
                    db.insertUserIfNotExists(ctx.message.reply_to_message.from, 0, 0);
                    let now = new Date();
                    if (now.getTime() - bot.userMemMap[ctx.from.id].lastDown.getTime() > 600000) { //10 Minuten
                        bot.userMemMap[ctx.from.id].lastDown = now;
                        ctx.reply(db.getUser(ctx.from.id).user_name + " entehrt " + db.getUser(ctx.message.reply_to_message.from.id).user_name);
                        db.removeKarma(ctx.message.reply_to_message.from.id, 1);
                    }
                }
            }
        }
        next();
    });
}