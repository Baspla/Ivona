const publicIp = require("public-ip");
const Permission = require("../utils/checks/permission");
const constants = require("../../constants");
exports.setupIp = setupIp;

function setupIp(bot) {
	bot.command("ip",Permission.hasPermission(constants.permissions.system.ip), (ctx) => {
		(async () => {
			ctx.reply("IP: "+await publicIp.v4());
		})();
	});
}