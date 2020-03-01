const shell = require('shelljs');
const Auth = require("../utils/AuthenticationCheck");
const roles = require("../utils/roles");

exports.setupRestart = setupRestart;

function setupRestart(bot) {
    bot.command('restart', (ctx) => {
        bot.command('restart', Auth.roleRequired(roles.admin), (ctx) => {
            ctx.reply("Starte neu...");
            shell.exec('../restart.sh');
        });
    });
}