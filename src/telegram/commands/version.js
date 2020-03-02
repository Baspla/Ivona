exports.setupVersion=setupVersion;
function setupVersion(bot) {
    bot.command('version', (ctx) => {
        ctx.reply("Ich laufe auf Version <code>" + process.env.npm_package_version+"</code>",{parse_mode:"HTML"});
    });
}