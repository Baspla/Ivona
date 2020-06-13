const schedule = require("node-schedule");
const Telegraf = require("telegraf");
const config = require("../config");
const bot = new Telegraf(config.telegram.token);
const {performance} = require("perf_hooks");
require("./utils/utils");
let db = require("../data/db");
const https = require("https");
const utils = require("./utils/utils");
const {setupMc} = require("./commands/mc");
const {steamTest} = require("./scheduledTasks/steamTest");
const {setupIp} = require("./commands/ip");
const {setupBackup} = require("./commands/backup");
const {setupDebug} = require("./commands/debug");
const {setupJustThings} = require("./listeners/justThings");
const {setupVote} = require("./listeners/vote");
const {setupPoints} = require("./listeners/points");
const {setupStats} = require("./commands/stats");
const {setupEhre} = require("./commands/ehre");
const {setupTop} = require("./commands/top");
const {setupQuote} = require("./commands/quote");
const {setupClaim} = require("./commands/claim");
const {setupReload} = require("./commands/reload");
const {setupRegister} = require("./commands/register");
const {setupStart} = require("./commands/start");
const {setupVersion} = require("./commands/version");
const {setupHelp} = require("./commands/help");
const {setupRestart} = require("./commands/restart");
const {setupAnime} = require("./listeners/anime");
const {setupMagic} = require("./listeners/magic");
const {setupRandomCard} = require("./commands/randomCard");
const {dailyCard} = require("./scheduledTasks/dailyCard");

bot.use((ctx, next) => {
	let start = performance.now();
	let r = next();
	console.info("Der Request hat ", (performance.now() - start).toFixed(3), " Millisekunden zum Bearbeiten gebraucht.");
	return r;
});

setupVersion(bot);

bot.use((ctx, next) => {
	if (ctx.from !== undefined) {
		if (db.getUserByTGID(ctx.from.id) == null) {
			try {
				db.createUser(ctx.from.id, ctx.from.first_name, ctx.from.first_name, ctx.from.last_name, ctx.from.username);
				console.debug("Nutzer erstellt");
			} catch (e) {
				ctx.reply("Fehler. Bitte melde dich bei @TimMorgner");
				console.error("Nutzer konnte nicht erstellt werden: "+ e);
				return;
			}
		}else{
			console.debug("Nutzer vorhanden");
		}
		return next();
	} else {
		console.warn("Nachricht ohne \"from\": " + ctx);
	}
});

setupClaim(bot);
setupRegister(bot);

setupStart(bot);
bot.use((ctx, next) => {
	let user = db.getUserByTGID(ctx.from.id);
	if (ctx.chat == null) {
		return next();
	}
	if (utils.isGroupChat(ctx.chat.type)) {
		let group = db.getGroupByTGID(ctx.chat.id);
		if (group != null) {
			if (!db.getUserGroupByTGID(ctx.from.id, ctx.chat.id))
				db.createUserGroup(user.id, group.id);
			return next();
		}
	} else {
		return next();
	}
});

setupReload(bot);
setupRestart(bot);
setupBackup(bot);
setupDebug(bot);
setupIp(bot);
setupMc(bot);

setupAnime(bot);
setupMagic(bot);
setupRandomCard(bot);

setupHelp(bot);
setupQuote(bot);
setupTop(bot);
setupEhre(bot);
setupStats(bot);

setupPoints(bot);
setupVote(bot);

setupJustThings(bot);
schedule.scheduleJob("*/30 * * * *", function () {
	//console.log('minute executed');
	if (0 === Math.floor(Math.random() * Math.floor(11)))
		steamTest(bot);
});
schedule.scheduleJob("0 9 * * *", function () {
	//console.log('daily executed');
	dailyCard(bot);
});
schedule.scheduleJob("0 */1 * * *", function () {
	//console.log('hourly executed');
	if (config.dyndns.url !== undefined)
		https.get(config.dyndns.url);
});
bot.launch().then(() => console.info("Bot gestartet"));
