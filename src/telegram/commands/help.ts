import { Context, Telegraf } from "telegraf";

export { setupHelp };

const tail = "\n/version";
const head = "Das sind alle Befehle, die ich dir anbieten kann\n";


function setupHelp(bot:Telegraf) {
	bot.help( (ctx:Context) => {
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