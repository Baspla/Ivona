const Discord = require('discord.js');
const discordBot = new Discord.Client();

const TOKEN = process.env.DISCORD_TOKEN;
const channelID =  process.env.DISCORD_CHANNELID;

var cachedQuotes = null;

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
function reloadQuoteCache(ctx){
    aushangstafelChannel.fetchMessages().then(messages => {
        cachedQuotes = messages.array();
        console.log("done reloading");
        if(ctx != null)
            ctx.reply("Reload complete!");
    }).catch(err => {
        console.error(err)
    })
}

function getRandomQuote(){
    return sendQuote(aushangstafelChannel);
}

function sendQuote(channel){
    let rnd = Math.floor(Math.random() * cachedQuotes.length);
    console.log(cachedQuotes.length);
    console.log(rnd);
    console.log(cachedQuotes[rnd]);
    return cachedQuotes[rnd].content;
}

