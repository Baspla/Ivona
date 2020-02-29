const Discord = require('discord.js');
const discordBot = new Discord.Client();

const TOKEN = "NjgzMzQ2MzcxMzc3NzU4MjI0.Xlq03A.ya2Nd8DpZ3Ug9LZSdyZsrxN5pVU";
const channelID = "415966551817191435";

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

