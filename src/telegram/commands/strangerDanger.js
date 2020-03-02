const db = require("../../data/db");
const roles = require("../utils/roles");
const Auth = require("../utils/checks/authentication");

exports.setupStrangerDanger = setupStrangerDanger;

function setupStrangerDanger(bot) {
    bot.command('strangerDanger',Auth.roleRequired(roles.moderator,roles.admin), (ctx) => {
        const count = db.removeUsersWithoutRoles();
        ctx.reply(count.info+" Nutzer ohne Rollen entfernt.");
    });
}