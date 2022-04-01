import { userFlags } from "../../../constants/userFlags";
import { checkUserFlags } from "../../utils/checks/userFlags";


export { setupDebug };

function setupDebug(bot) {
	bot.command("debug",checkUserFlags(userFlags.admin.debug), (ctx) => {
		ctx.reply("Telegram Bot läuft");
	});
}