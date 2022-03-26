"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isReply = exports.isCreator = exports.isUserChat = exports.isGroupChat = void 0;
exports.default = { isGroupChat, isUserChat, isCreator, isReply };
function isGroupChat(type) {
    return type === "group" || type === "supergroup";
}
exports.isGroupChat = isGroupChat;
function isUserChat(type) {
    return type === "private";
}
exports.isUserChat = isUserChat;
function isCreator(id) {
    return id === 67025299;
}
exports.isCreator = isCreator;
function isReply(ctx) {
    if (ctx.message.reply_to_message !== undefined) {
        return ctx.message.reply_to_message.from !== undefined;
    }
    return false;
}
exports.isReply = isReply;
/*export function checkLevelUp(ctx, ug) {
    const newug = db.getUserGroup(ug.user.id, ug.group.id);
    if (newug != null) {
        let levelNow = newug.level;
        let levelPrev = ug.level;
        let dist = levelNow - levelPrev;
        if (dist === 1) {
            ctx.replyWithPhoto("smug.moe/smg/" + levelNow + ".png", {caption: newug.user.name + " ist jetzt ein " + newug.titel});
        } else if (dist > 1) {
            ctx.replyWithPhoto("smug.moe/smg/" + levelNow + ".png", {caption: newug.user.name + " ist jetzt ein " + newug.titel + " und hat " + (dist - 1) + " Level übersprungen"});
        }
    }
}*/ 
//# sourceMappingURL=utils.js.map