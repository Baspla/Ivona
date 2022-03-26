import '../../utils/utils.js';
import * as discord from '../../discord/discordBot.js';
import * as Permission from '../../utils/checks/permission.js';
import * as constants from '../../../constants.js';

export { setupQuote };

function setupQuote(bot) {
	bot.command("quote",Permission.hasPermission(constants.permissions.discord.quote), (ctx) => {
		//const quote = discord.getRandomQuote();
		//if (quote !== undefined) {
		//	ctx.reply(quote);
		//}
	});
}