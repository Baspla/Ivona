const db = require("../../data/db");
const Auth = require("../utils/checks/authentication");

exports.setupUserlist = setupUserlist;

function setupUserlist(bot) {
    bot.command('userlist', Auth.roleRequired("admin"), (ctx) => {
        let text = "User: \n";
        db.getUsersWithRoles().forEach((row) => {
            text += row.user_name + " - Rollen: " + row.roles + "\n";
        });
        ctx.reply(text);
    });
}