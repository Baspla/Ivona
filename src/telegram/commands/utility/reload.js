import '../utils/utils.js';
import * as discord from '../../discord/discordBot.js';
import * as Permission from '../utils/checks/permission.js';
import * as constants from '../../constants.js';

export { setupReload };

function setupReload(bot) {
	bot.command("reload", Permission.hasPermission(constants.permissions.system.reload), (ctx) => {
		discord.reloadQuoteCache(ctx);
	});
}