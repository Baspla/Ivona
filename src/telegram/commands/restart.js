const shell = require("shelljs");
const Permission = require("../utils/checks/permission");
const constants = require("../../constants");

exports.setupRestart = setupRestart;

function setupRestart(bot) {
	bot.command("restart", Permission.hasPermission(constants.permissions.system.restart), (ctx) => {
		ctx.reply("Starte neu...");
		shell.exec("../restart.sh");
	});
}