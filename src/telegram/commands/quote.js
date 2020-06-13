require("../utils/utils");
const discord = require("../../discord/discordBot");
const Permission = require("../utils/checks/permission");
const constants = require("../../constants");

exports.setupQuote = setupQuote;

function setupQuote(bot) {
	bot.command("quote",Permission.hasPermission(constants.permissions.discord.quote), (ctx) => {
		const quote = discord.getRandomQuote();
		if (quote !== undefined) {
			ctx.reply(quote);
		}
	});
}