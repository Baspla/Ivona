const levelmanager = require("./levels");
module.exports = {
    isGroupChat(type) {
        return type === "group" || type === "supergroup";
    }, isUserChat(type) {
        return type === "user";
    },
    isCreator(id) {
        return id === 67025299;
    },
    isReply(ctx) {
        if (ctx.message.reply_to_message !== undefined) {
            return ctx.message.reply_to_message.from !== undefined;
        }
        return false;
    },
    checkLevelUp(ctx, id, previous) {
        let user = db.getUser(id);
        if (user !== undefined) {
            let levelNow = levelmanager.getLevel(user.user_points);
            let levelPrev = levelmanager.getLevel(previous);
            let dist = levelNow - levelPrev;
            if (dist === 1) {
                ctx.replyWithPhoto("smug.moe/smg/" + levelNow + ".png", {caption: user.user_name + " ist jetzt ein " + levelmanager.getTitel(levelNow)});
            } else if (dist > 1) {
                ctx.replyWithPhoto("smug.moe/smg/" + levelNow + ".png", {caption: user.user_name + " ist jetzt ein " + levelmanager.getTitel(levelNow) + " und hat " + (dist - 1) + " Level übersprungen"});
            }
        }
    }
};