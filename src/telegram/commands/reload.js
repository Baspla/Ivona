require("../utils/utils");
const discord = require("../../discord/discordBot");
const Permission = require("../utils/checks/permission");
const constants = require("../../constants");

exports.setupReload = setupReload;

function setupReload(bot) {
	bot.command("reload", Permission.hasPermission(constants.permissions.system.reload), (ctx) => {
		discord.reloadQuoteCache(ctx);
	});
}