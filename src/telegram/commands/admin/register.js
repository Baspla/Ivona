import utils from '../utils/utils.js';

export { setupRegister };

function setupRegister(bot) {
	bot.command("register", (ctx) => {
		if (utils.isGroupChat(ctx.chat.type)) {
			//TODO
			/*if (db.getGroupByTGID(ctx.chat.id) === undefined) {
				try {
					db.createGroup(ctx.chat.id, ctx.chat.title);
					ctx.reply("Gruppe hinzugefügt.");
				} catch (e) {
					ctx.reply("Fehler: "+e);
				}
			} else ctx.reply("Diese Gruppe ist schon registriert.");*/
		} else
			ctx.reply("Das ist keine Gruppe...");
	}
	)
	;
}