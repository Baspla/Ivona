const db = require("../../data/db");
const Command = require("../utils/checks/arguments");
const Auth = require("../utils/checks/authentication");
const roles = require("../utils/roles");
exports.setupMod = setupMod;

function setupMod(bot) {
    bot.command('mod', Command.minimumArgs(1), Auth.roleRequired(roles.admin), (ctx) => {
        const name = ctx.args.join(" ");
        const user = db.getUserFromName(name);
        if (user === undefined) {
            ctx.reply("Unbekannter Nutzer");
        } else if (!db.hasUserRole(user.id, roles.moderator)) {
            db.addUserRole(user.id, roles.moderator);
            ctx.reply(user.name + " wurde der Moderator Status anerkannt.");
        } else {
            db.removeUserRole(user.id, roles.moderator);
            ctx.reply(user.name + " wurde der Moderator Status aberkannt.");
        }
    });
}