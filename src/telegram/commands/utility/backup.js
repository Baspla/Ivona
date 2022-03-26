import db from '../../data/db.js';
import * as Location from '../utils/checks/location.js';
import * as Permission from '../utils/checks/permission.js';
import * as constants from '../../constants.js';

export { setupBackup };

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