const utils = require("../utils/utils");
const db = require("../../data/db");
const features = require("../utils/features");
exports.setupVote = setupVote;

function setupVote(bot) {
    // Super Ehren
    bot.hears(/^(\u2764\ufe0f|\ud83d\udc96|\ud83e\udde1|\ud83d\udc9b|\ud83d\udc9a|\ud83d\udc99|\ud83d\udc9c|\ud83d\udda4).*|.*(\u2764\ufe0f|\ud83d\udc96|\ud83e\udde1|\ud83d\udc9b|\ud83d\udc9a|\ud83d\udc99|\ud83d\udc9c|\ud83d\udda4)$/, (ctx, next) => {
            if (utils.isReply(ctx) && utils.isGroupChat(ctx.chat.type)) {
                const group = db.getGroupByTGID(ctx.chat.id);
                const user = db.getUserByTGID(ctx.from.id);
                if (group !== undefined && user !== undefined) {
                    if (!db.hasGroupFeature(group.id, features.karma)) return next();
                    const ustats = db.getUserGroup(user.id, group.id);
                    if (ustats !== undefined) {
                        if (ctx.message.reply_to_message.from !== undefined && !ctx.message.reply_to_message.from.is_bot) {
                            const to = db.getUserByTGID(ctx.message.reply_to_message.from.id);
                            if (to !== undefined) {
                                const tostats = db.getUserGroup(to.id, group.id);
                                if (tostats !== undefined) {
                                    if (ctx.message.reply_to_message.from.id !== ctx.from.id) {
                                        let now = new Date().getTime();
                                        if (now - ustats.lastSuper > 7200000) { //2 Stunden
                                            db.setUserGroupLastSuper(user.id, group.id, now);
                                            ctx.reply("<a href=\"tg://user?id=" + user.tgid + "\">" + user.name + "</a> ehrt <a href=\"tg://user?id=" + to.tgid + "\">" + to.name + "</a> absolut hart!", {
                                                parse_mode: "HTML",
                                                disable_notification: true
                                            });
                                            db.setUserGroupKarma(to.id, group.id, tostats.karma + 3);
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
            next();
        }
    );

    // Ehren
    bot.hears(/^(\u002b|\u261d|\ud83d\udc46|\ud83d\udc4f|\ud83d\ude18|\ud83d\ude0d|\ud83d\udc4c|\ud83d\udc4d|\ud83d\ude38).*|.*(\u002b|\u261d|\ud83d\udc46|\ud83d\udc4f|\ud83d\ude18|\ud83d\ude0d|\ud83d\udc4c|\ud83d\udc4d|\ud83d\ude38)$/, (ctx, next) => {
        if (utils.isReply(ctx) && utils.isGroupChat(ctx.chat.type)) {
            const group = db.getGroupByTGID(ctx.chat.id);
            const user = db.getUserByTGID(ctx.from.id);
            if (group !== undefined && user !== undefined) {
                if (!db.hasGroupFeature(group.id, features.karma)) return next();
                const ustats = db.getUserGroup(user.id, group.id);
                if (ustats !== undefined) {
                    if (ctx.message.reply_to_message.from !== undefined && !ctx.message.reply_to_message.from.is_bot) {
                        const to = db.getUserByTGID(ctx.message.reply_to_message.from.id);
                        if (to !== undefined) {
                            const tostats = db.getUserGroup(to.id, group.id);
                            if (tostats !== undefined) {
                                if (ctx.message.reply_to_message.from.id !== ctx.from.id) {
                                    let now = new Date().getTime();
                                    if (now - ustats.lastUp > 300000) { //5 Minuten
                                        db.setUserGroupLastUp(user.id, group.id, now);
                                        ctx.reply("<a href=\"tg://user?id=" + user.tgid + "\">" + user.name + "</a> ehrt <a href=\"tg://user?id=" + to.tgid + "\">" + to.name + "</a>.", {
                                            parse_mode: "HTML",
                                            disable_notification: true
                                        });
                                        db.setUserGroupKarma(to.id, group.id, tostats.karma + 1);
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
        next();
    });

    // Entehren
    bot.hears(/^(\u2639\ufe0f|\ud83d\ude20|\ud83d\ude21|\ud83e\udd2c|\ud83e\udd2e|\ud83d\udca9|\ud83d\ude3e|\ud83d\udc4e|\ud83d\udc47).*|.*(\u2639\ufe0f|\ud83d\ude20|\ud83d\ude21|\ud83e\udd2c|\ud83e\udd2e|\ud83d\udca9|\ud83d\ude3e|\ud83d\udc4e|\ud83d\udc47)$/, (ctx, next) => {
        if (utils.isReply(ctx) && utils.isGroupChat(ctx.chat.type)) {
            const group = db.getGroupByTGID(ctx.chat.id);
            const user = db.getUserByTGID(ctx.from.id);
            if (group !== undefined && user !== undefined) {
                if (!db.hasGroupFeature(group.id, features.karma)) return next();
                const ustats = db.getUserGroup(user.id, group.id);
                if (ustats !== undefined) {
                    if (ctx.message.reply_to_message.from !== undefined && !ctx.message.reply_to_message.from.is_bot) {
                        const to = db.getUserByTGID(ctx.message.reply_to_message.from.id);
                        if (to !== undefined) {
                            const tostats = db.getUserGroup(to.id, group.id);
                            if (tostats !== undefined) {
                                if (ctx.message.reply_to_message.from.id !== ctx.from.id) {
                                    let now = new Date().getTime();
                                    if (now - ustats.lastDown > 600000) { //10 Minuten
                                        db.setUserGroupLastDown(user.id, group.id, now);
                                        ctx.reply("<a href=\"tg://user?id=" + user.tgid + "\">" + user.name + "</a> entehrt <a href=\"tg://user?id=" + to.tgid + "\">" + to.name + "</a>.", {
                                            parse_mode: "HTML",
                                            disable_notification: true
                                        });
                                        db.setUserGroupKarma(to.id, group.id, tostats.karma - 1);
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
        next();
    });
}