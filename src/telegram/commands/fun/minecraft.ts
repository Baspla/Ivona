import '../../utils/utils.js';
import MCAPI from 'minecraft-lib';
import * as config from '../../../config.js';
import { Composer } from 'telegraf';
import { hasGroupFlags } from '../../predicates/HasGroupFlags.js';
import { groupFlags } from '../../../constants/groupFlags.js';
import { getVariable } from '../../../data/data.js';

export const minecraftCommand = Composer.optional(hasGroupFlags(groupFlags.feature.minecraft), Composer.command("minecraft", (ctx) => {
	let ip = getVariable("minecraft:ip");
	let port = getVariable("minecraft:port");
	let promise = MCAPI.servers.get(ip,port);
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
}))