exports.setupHelp = setupHelp;

function setupHelp(bot) {
    bot.help((ctx) => ctx.reply('Hilfe'));
}