const db = require("../../data/db");
const utils = require("../utils/utils");
const features = require("../utils/features");

exports.setupPoints = setupPoints;

function setupPoints(bot) {
    bot.use((ctx, next) => {
        const user = db.getUserByTGID(ctx.from.id);
        if (user !== undefined) {
            if (ctx.chat !== undefined) {
                if (utils.isGroupChat(ctx.chat.type)) {
                    const group = db.getGroupByTGID(ctx.chat.id);
                    if (group !== undefined) {
                        if (!db.hasGroupFeature(group.id, features.points)) return next();
                        const ug = db.getUserGroup(user.id, group.id);
                        let now = new Date().getTime();
                        if (now - ug.lastReward > 180000) { //3 Minuten
                            db.setUserGroupLastReward(user.id, group.id, now);
                            const previous = user.points;
                            db.setUserGroupPoints(user.id, group.id, ug.points + Math.floor(Math.random() * 12) + 1);
                            utils.checkLevelUp(ctx, ctx.from.id, previous);
                        }
                    }
                }
            }
        }
        next();
    });
}