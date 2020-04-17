const justThings = require("../utils/justThingsImageGeneator");
const utils = require("../utils/utils");
const features = require("../utils/features");
exports.setupJustThings = setupJustThings;

function setupJustThings(bot) {
    bot.hears(/^((wenn)|(when))[ \n]/i, (ctx,next) => {
        if (utils.isGroupChat(ctx.chat.type)) {
            const group = db.getGroupByTGID(ctx.chat.id);
            if (group !== undefined) {
                if (!db.hasGroupFeature(group.id, features.justThings)) return next();
                justThings.generateImage(ctx.message.text, ctx.from.first_name, () =>
                    ctx.replyWithPhoto({source: "resources/justThings.png"}));
            }
        }
        next();
    });
}