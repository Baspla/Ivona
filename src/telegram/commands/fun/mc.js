import '../../utils/utils.js';
import MCAPI from 'minecraft-lib';
import * as config from '../../../config.js';

export { setupMc };

function setupMc(bot) {
	bot.command("mc", (ctx) => {
		let promise = MCAPI.servers.get(config.minecraft.ip, config.minecraft.port);
		promise.then(server => {
			if (server !== undefined) {
				let txt = "";
				let sample = server.players.sample;
				if (sample != null) {
					for (let i = 0; i < sample.length; i++) {
						txt = txt + "\n" + sample[i].username;
					}
				}
				ctx.replyWithHTML("<b>"+server.version+" Minecraft Server</b> (" + server.players.online + "/" + server.players.max + ")\n<i>"+server.motd.formatted+"</i>" + txt);
			}
		});
	});
}