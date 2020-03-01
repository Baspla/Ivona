const utils = require("../utils/utils");
const discord = require("../../discord/discordBot");
const Auth = require("../utils/AuthenticationCheck");
const roles = require("../utils/roles");

exports.setupReload = setupReload;

function setupReload(bot) {
    bot.command("reload", Auth.roleRequired(roles.moderator, roles.admin), (ctx) => {
        discord.reloadQuoteCache(ctx);
    });
}