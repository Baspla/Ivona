const db = require("../../data/db");
const Command = require("../utils/checks/arguments");
const Auth = require("../utils/checks/authentication");
const roles = require("../utils/roles");

exports.setupCoder = setupCoder;

function setupCoder(bot) {
    bot.command('coder', Command.minimumArgs(1), Auth.roleRequired(roles.moderator,roles.admin), (ctx) => {
        const name = ctx.args.join(" ");
        const user = db.getUserByName(name);
        if (user === undefined) {
            ctx.reply("Unbekannter Nutzer");
        } else if (!db.hasUserRole(user.id, roles.coder)) {
            db.addUserRole(user.id, roles.coder);
            ctx.reply(user.name + " wurde der Coder Status anerkannt.");
        } else {
            db.removeUserRole(user.id, roles.coder);
            ctx.reply(user.name + " wurde der Coder Status aberkannt.");
        }
    });
}