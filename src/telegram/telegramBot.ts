import { Telegraf } from 'telegraf';
import * as config from '../config.js';
import { performance } from 'perf_hooks';
import { setupVersion } from './commands/utility/version';
import { hasChatAndFrom } from './asserts/hasChatAndFrom.js';

const bot = new Telegraf(config.telegram.token);

/**
 * Zeichnet die Performanz einer Anfrage auf
 */
bot.use((ctx, next) => {
	let start = performance.now();
	let r = next();
	console.info("Die Anfrage hat", (performance.now() - start).toFixed(3), "Millisekunden zum Bearbeiten gebraucht.");
	return r;
});

setupVersion(bot);

/**
 * Erstellt einen Nutzer, falls dieser noch nicht existert
 */
bot.use(hasChatAndFrom)


/*bot.use((ctx, next) => {
	if (ctx.from !== undefined) {
		createUser(ctx.from.id, ctx.from.first_name, ctx.from.last_name, ctx.from.username, ctx.from.first_name,)
			.then((v) => {
				if (v > 0)
					console.debug("Nutzer " + ctx.from.id + " wurde erstellt");
				next();
			}).catch((err) => {
				ctx.reply("Fehler. Bitte melde dich bei @TimMorgner");
				console.error("Nutzer konnte nicht erstellt werden: " + err);
			})
	} else {
		console.warn("Nachricht ohne \"from\": " + ctx);
	}
});

bot.use((c,next)=>{console.debug("Step 3");next();})
//	setupClaim(bot);
setupRegister(bot);

setupStart(bot);

bot.use((c,next)=>{console.debug("Step 4");next();})
/**
 * Fügt Nutzer zur Gruppe hinzu, falls diese noch nicht existert
 */
/*bot.use((ctx, next) => {
	if (ctx.chat == null) {
		return next();
	}
	if (utils.isGroupChat(ctx.chat.type)) {
		groupExists(ctx.chat.id).then((int) => {
			if (int == 1) {
				addUserToGroup(ctx.from.id, ctx.chat.id)
					.then((v) => {
						if (v > 0)
							console.debug("Nutzer " + ctx.from.id + " wurde der Gruppe " + ctx.chat.id + " hinzugefügt");
						next();
					}).catch((err) => {
						console.error("Nutzer konnte Gruppe nicht hinzugefügt werden: " + err);
					})
			}
		})
		return;
	}
	return next();
});

bot.use((c,next)=>{console.debug("Step 5" );next();})
setupPoints(bot);
setupVote(bot);

bot.use((c,next)=>{console.debug("Step 6");next();})
//setupReload(bot);
setupRestart(bot);
//setupBackup(bot);
setupDebug(bot);
//setupMc(bot);

bot.use((c,next)=>{console.debug("Step 7");next();})
//setupAnime(bot);
setupMagic(bot);
//setupRandomCard(bot);

bot.use((c,next)=>{console.debug("Step");next();})
setupHelp(bot);
setupTop(bot);
setupEhre(bot);
//setupStats(bot);

//setupHaiku(bot);

//setupJustThings(bot);*/
//schedule.scheduleJob("*/30 * * * *", function () {
//	if (0 === Math.floor(Math.random() * Math.floor(11)))
//		steamTest(bot);
//});
//schedule.scheduleJob("0 9 * * *", function () {
//	dailyCard(bot);
//});
//schedule.scheduleJob("0 */1 * * *", function () {
//});
bot.use(()=>{console.debug("Die Anfrage wurde bis zum Ende durchgereicht")})
bot.launch().then(() => console.info("Der Bot wurde gestartet"))