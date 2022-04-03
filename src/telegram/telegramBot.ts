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
bot.use(hasChatAndFrom)
bot.use(()=>{console.debug("Die Anfrage wurde bis zum Ende durchgereicht")})
bot.launch().then(() => console.info("Der Bot wurde gestartet"))