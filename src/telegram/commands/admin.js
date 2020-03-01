const db = require("../../data/db");
const Command = require("../utils/ArgumentsCheck");
const Auth = require("../utils/AuthenticationCheck");
const roles = require("../utils/roles");
exports.setupAdmin = setupAdmin;

function setupAdmin(bot) {
    bot.command('admin', Command.minimumArgs(1), Auth.roleRequired("admin"), (ctx) => {
        const name = ctx.args.join(" ");
        const user = db.getUserFromName(name);
        if (user === undefined) {
            ctx.reply("Unbekannter Nutzer");
        } else if (!db.hasUserRole(user.user_id, roles.admin)) {
            db.insertUserRole(user.user_id, roles.admin);
            ctx.reply(user.user_name + " wurde der Administrator Status anerkannt.");
        } else {
            db.deleteUserRole(user.user_id, roles.admin);
            ctx.reply(user.user_name + " wurde der Administrator Status aberkannt.");
        }
    });
}