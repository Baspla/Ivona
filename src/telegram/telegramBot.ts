import { Telegraf } from 'telegraf';
import * as config from '../config.js';
import { performance } from 'perf_hooks';
import { setupVersion } from './commands/utility/version';
import { hasChatAndFrom } from './asserts/hasChatAndFrom.js';
import {BotCommandScope} from 'typegram/bot-command-scope.d';

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
bot.on("text",(ctx,next)=>{console.debug("Nachricht:",ctx.message.text);next()})
setupVersion(bot);
bot.use(hasChatAndFrom)
bot.use(()=>{console.debug("Die Anfrage wurde bis zum Ende durchgereicht")})
bot.launch().then(() => {
	console.info("Der Bot wurde gestartet")
	bot.telegram.setMyCommands([
		{command:"help",description:"zeigt ein Hilfe Menü an"},
		{command:"stats",description:"zeigt deine Statistiken an"},
		{command:"version",description:"zeigt die aktuelle Version des Bots an"}
	],{scope:{type:"default"},language_code:"de"})
	bot.telegram.setMyCommands([
		{command:"help",description:"shows a help menu"},
		{command:"stats",description:"shows your stats"},
		{command:"version",description:"show the bots current version"}
	],{scope:{type:"default"},language_code:""})
})