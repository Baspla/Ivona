
export default {isGroupChat,isUserChat,isCreator, isReply}
export function isGroupChat(type) {
    return type === "group" || type === "supergroup";
}

export function isUserChat(type) {
    return type === "private";
}

export function isCreator(id) {
    return id === 67025299;
}

export function isReply(ctx) {
    if (ctx.message.reply_to_message !== undefined) {
        return ctx.message.reply_to_message.from !== undefined;
    }
    return false;
}

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