import db from '../../../data/db.js';
import utils from '../../utils/utils.js';

export { setupClaim };

function setupClaim(bot) {
	bot.command("claim", (ctx) => {
		if (utils.isCreator(ctx.from.id)) {
			let user = db.getUserByTGID(ctx.from.id);
			//TODO
		}
	});
}