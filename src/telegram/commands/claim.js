const db = require("../../data/db");
const utils = require("../utils/utils");

exports.setupClaim = setupClaim;

function setupClaim(bot) {
	bot.command("claim", (ctx) => {
		if (utils.isCreator(ctx.from.id)) {
			let user = db.getUserByTGID(ctx.from.id);
			//TODO
		}
	});
}