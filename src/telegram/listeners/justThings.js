const justThings = require("../utils/justThingsImageGeneator");
const utils = require("../utils/utils");
exports.setupJustThings = setupJustThings;

function setupJustThings(bot) {
    bot.hears(/^((wenn)|(when))[ \n]/i, (ctx) => {
        if (utils.isGroupChat(ctx.chat.type)) {
            justThings.generateImage(ctx.message.text, ctx.from.first_name, () =>
                ctx.replyWithPhoto({source: "resources/justThings.png"}));
        }
    });
}