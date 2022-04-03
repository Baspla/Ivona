export { setupVersion };
function setupVersion(bot) {
	bot.command("version", (ctx) => {
		ctx.reply("Ich laufe auf Version <code> 2.0.0 </code>",{parse_mode:"HTML"});
	});
}