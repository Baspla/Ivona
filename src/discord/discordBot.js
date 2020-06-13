const Discord = require("discord.js");
const discordBot = new Discord.Client();

const TOKEN = process.env.DISCORD_TOKEN;
const channelID = process.env.DISCORD_CHANNELID;

let cachedQuotes = [];

let aushangstafelChannel = null;

let disabled = false;

exports.isDisabled=function() {return disabled;};
exports.reloadQuoteCache = reloadQuoteCache;
exports.getRandomQuote = getRandomQuote;

if (TOKEN === undefined || channelID === undefined) {
	console.warn("DISCORD_TOKEN oder DISCORD_CHANNELID fehlt. Discord Bot wird nicht gestartet");
	disabled = true;
	return;
}
discordBot.login(TOKEN);
discordBot.on("ready", () => {
	console.info("Logged in!");
	aushangstafelChannel = discordBot.channels.get(channelID);
	reloadQuoteCache(null);
});


async function reloadQuoteCache(ctx, limit = 500) {
	let last_id;

	while (!disabled) {
		const options = {limit: 100};
		if (last_id) {
			options.before = last_id;
		}
		const messages = await aushangstafelChannel.fetchMessages(options);
		cachedQuotes.push(...messages.array());
		last_id = messages.last().id;

		if (messages.size !== 100 || cachedQuotes.length >= limit) {
			break;
		}
	}
}

function getRandomQuote() {
	if (disabled) return undefined;
	let rnd = Math.floor(Math.random() * cachedQuotes.length);
	if (rnd === 0) rnd++;
	return cachedQuotes[rnd].content;
}

