const Auth = require("../utils/checks/authentication");
const roles = require("../utils/roles");
const publicIp = require('public-ip');
exports.setupIp = setupIp;

function setupIp(bot) {
    bot.command('ip',Auth.roleRequired(roles.admin), (ctx) => {
        (async () => {
            ctx.reply("IP: "+await publicIp.v4());
        })();
    });
}