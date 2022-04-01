import shell from 'shelljs';
import * as constants from '../../../constants/constants.js';
import { userFlags } from '../../../constants/userFlags.js';
import { checkUserFlags } from '../../utils/checks/userFlags.js';

export { setupRestart };
let restartProtection = 0;

function setupRestart(bot) {
	bot.command("restart",checkUserFlags(userFlags.admin.restart), (ctx) => {
		if (restartProtection <= 0) {
			ctx.reply("Restart Protection\nGib noch ein mal /restart ein");
			restartProtection++;
		} else {
			ctx.reply("Starte neu...");
			shell.exec("../restart.sh");
		}
	});
}