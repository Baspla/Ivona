const db = require("../../data/db");
const utils = require("../utils/utils");
const roles = require("../utils/roles");

exports.setupClaim = setupClaim;

function setupClaim(bot) {
    bot.command('claim', (ctx) => {
        if (utils.isCreator(ctx.from.id)) {
            let user = db.getUserByTGID(ctx.from.id);
            if (!db.hasUserRole(user.id, roles.admin)) {
                ctx.reply("Du bist jetzt Admin.");
                db.addUserRole(user.id, roles.admin);
            } else {
                ctx.reply("Du bist schon Admin.");
            }
        }
    });
}