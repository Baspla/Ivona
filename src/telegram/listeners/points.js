const db = require("../../data/db");
const utils = require("../utils/utils");

exports.setupPoints = setupPoints;

function setupPoints(bot) {
    bot.use((ctx, next) => {
        const user = db.getUser(ctx.from.id);
        if (user !== undefined) {
            if (bot.userMemMap[user.user_id] === undefined) {
                const epoch = new Date(0);
                bot.userMemMap[user.user_id] = {lastUp: epoch, lastDown: epoch, lastSuper: epoch, lastReward: epoch}
            }
            if (ctx.chat !== undefined) {
                if (utils.isGroupChat(ctx.chat.type)) {
                    let now = new Date();
                    if (now.getTime() - bot.userMemMap[user.user_id].lastReward.getTime() > 180000) { //3 Minuten
                        bot.userMemMap[user.user_id].lastReward = now;

                        const previous = user.user_points;
                        db.addPoints(user.user_id, Math.floor(Math.random() * 12) + 1);
                        utils.checkLevelUp(ctx, ctx.from.id, previous);
                    }
                }
            }
        }
        next();
    });
}