module.exports = {
    isGroup(type) {
        return type === "group" || type === "supergroup";
    },
    isCreator(id) {
        return id === 67025299;
    },
    isReply(ctx) {
        if(ctx.message.reply_to_message!==undefined){
            return ctx.message.reply_to_message.from!==undefined;
        }
        return false;
    }
};