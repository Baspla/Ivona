const db = require("../../data/db");
const Location = require("../utils/checks/location");
const Permission = require("../utils/checks/permission");
const constants = require("../../constants");

exports.setupBackup = setupBackup;

function setupBackup(bot) {
	bot.command("backup", Permission.hasPermission(constants.permissions.database.backup),Location.User,(ctx) => {
		const filename="resources/backup.db";
		ctx.reply("Starte Backup");
		db.backup(filename)
			.then(() => {
				console.info("Backup an "+ctx.from.id+" gesendet");
				ctx.replyWithDocument({source:filename});
			})
			.catch((err) => {
				ctx.reply("Backup fehlgeschlagen.\n\n"+err);
			});
	});
}