const Discord = require('discord.js');
const discordBot = new Discord.Client();

const TOKEN = process.env.DISCORD_TOKEN;
const channelID =  process.env.DISCORD_CHANNELID;

var cachedQuotes = [];

var aushangstafelChannel = null;

exports.discordBotInit=discordBotInit;
exports.reloadQuoteCache=reloadQuoteCache;
exports.getRandomQuote=getRandomQuote;

function discordBotInit(){
    discordBot.login(TOKEN);
    discordBot.on('ready', () => {
        console.info('Logged in!');
        aushangstafelChannel = discordBot.channels.get(channelID);
        reloadQuoteCache(null);
    });
}

async function reloadQuoteCache(ctx, limit = 500) {
    let last_id;

    while (true) {
        const options = { limit: 100 };
        if (last_id) {
            options.before = last_id;
        }
        const messages = await aushangstafelChannel.fetchMessages(options);
        cachedQuotes.push(...messages.array());
        last_id = messages.last().id;

        if (messages.size != 100 || cachedQuotes.length >= limit) {
            break;
        }
    }
}

function getRandomQuote(){
    console.log(cachedQuotes.length);
    return sendQuote(aushangstafelChannel);
}

function sendQuote(channel){
    let rnd = Math.floor(Math.random() * cachedQuotes.length);
    if(rnd == 0) rnd++;
    return cachedQuotes[rnd].content;
}

