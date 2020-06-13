const Location = require("../utils/checks/location");
exports.setupHelp = setupHelp;

const tail = "\n/version";
const head = "Das sind alle Befehle, die ich dir anbieten kann\n";


function setupHelp(bot) {
	bot.help(Location.User, (ctx) => {
		let txt = head;
		txt += "\nUser-Befehle:\n" +
                "/quote - Zufälliges Zitat\n" +
                "/top - Top 10 Punktesammler\n" +
                "/ehre - Top 10 Ehrenmänner\n" +
                "/stats - deine Stats\n";
		txt += tail;
		ctx.reply(txt);
	});
}