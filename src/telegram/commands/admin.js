const db = require("../../data/db");
const Command = require("../utils/checks/arguments");
const Auth = require("../utils/checks/authentication");
const roles = require("../utils/roles");
exports.setupAdmin = setupAdmin;

function setupAdmin(bot) {
    bot.command('admin', Command.minimumArgs(1), Auth.roleRequired(roles.admin), (ctx) => {
        const name = ctx.args.join(" ");
        const user = db.getUserByName(name);
        if (user === undefined) {
            ctx.reply("Unbekannter Nutzer");
        } else if (!db.hasUserRole(user.id, roles.admin)) {
            db.addUserRole(user.id, roles.admin);
            ctx.reply(user.name + " wurde der Administrator Status anerkannt.");
        } else {
            db.removeUserRole(user.id, roles.admin);
            ctx.reply(user.name + " wurde der Administrator Status aberkannt.");
        }
    });
}