const utils = require("../utils/utils");

exports.setupRegisterGroup = setupRegisterGroup;

function setupRegisterGroup(bot) {
    bot.command('registerGroup', (ctx) => {
        if (utils.isCreator(ctx.from.id)) {
            if (utils.isGroupChat(ctx.chat.type)) {
                if (!db.isRegisteredGroup(ctx.chat.id)) {
                    db.insertGroup(ctx.chat.id);
                    ctx.reply("Gruppe hinzugefügt.");
                } else ctx.reply("Diese Gruppe ist schon registriert.");
            } else ctx.reply("Das ist keine Gruppe...");
        }
    });
}