const db = require("../../data/db");
const Auth = require("../utils/checks/authentication");
const roles = require("../utils/roles");

exports.setupUserlist = setupUserlist;

function setupUserlist(bot) {
    bot.command('userlist', Auth.roleRequired(roles.admin), (ctx) => {
        let text = "User: \n";
        db.getUsers().forEach((row) => {
            text += row.name +"\n ";
        });
        ctx.reply(text);
    });
}