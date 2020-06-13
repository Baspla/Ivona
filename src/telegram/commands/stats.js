const db = require("../../data/db");
const constants = require("../../constants");
exports.setupStats = setupStats;

function setupStats(bot) {
	bot.command("stats", (ctx) => {
		const user = db.getUserByTGID(ctx.from.id);
		let txt="";
		db.getUserGroups(user.id).forEach((ug) => {
			txt = txt+"<b>"+ ug.group.title+"</b>\nPunkte: " + ug.points + "\nEhre: " + ug.karma+"\n\n";
		});
		ctx.replyWithHTML("Name: "+user.name +"\nGeld: "+user.money+constants.currency.symbol+"\n\n"+txt);
	});
}