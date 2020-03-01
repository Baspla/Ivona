const db = require("../../data/db");
const Command = require("../utils/ArgumentsCheck");
const Auth = require("../utils/AuthenticationCheck");
const roles = require("../utils/roles");

exports.setupCoder = setupCoder;

function setupCoder(bot) {
    bot.command('coder', Command.minimumArgs(1), Auth.roleRequired(roles.moderator,roles.admin), (ctx) => {
        const name = ctx.args.join(" ");
        const user = db.getUserFromName(name);
        if (user === undefined) {
            ctx.reply("Unbekannter Nutzer");
        } else if (!db.hasUserRole(user.user_id, roles.coder)) {
            db.insertUserRole(user.user_id, roles.coder);
            ctx.reply(user.user_name + " wurde der Coder Status anerkannt.");
        } else {
            db.deleteUserRole(user.user_id, roles.coder);
            ctx.reply(user.user_name + " wurde der Coder Status aberkannt.");
        }
    });
}