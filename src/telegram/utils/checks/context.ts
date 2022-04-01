//Beschränkungen auf Grunde des Chat Kontexts. (Privat, Gruppe)
export const checkChatContext = (c_context: "private" | "group" | "supergroup" | "channel" | "anygroup" | "nonchannel" | "any") => {
    return (ctx, next) => {
        if (ctx.chat.type == c_context) {
            return next();
        }
        switch (c_context) {
            case "anygroup":
                if (ctx.chat.type == "group" || ctx.chat.type == "supergroup"){
                    return next();
                }
                break;
            case "nonchannel":
                if (ctx.chat.type == "group" || ctx.chat.type == "private" || ctx.chat.type == "supergroup"){
                    return next();
                }
                break;
            case "any":
                return next();
        }
        ctx.reply("Falsche Umgebung")
    };
};

/*
    private,
    group,
    supergroup,
    channel,
    anygroup,
    nonchannel,
    any
*/