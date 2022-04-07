import '../../utils/utils.js';
import { MinecraftServerListPing } from 'minecraft-status';
import * as config from '../../../config.js';
import { Composer } from 'telegraf';
import { hasGroupFlags } from '../../predicates/HasGroupFlags.js';
import { groupFlags } from '../../../constants/groupFlags.js';
import { getVariable } from '../../../data/data.js';

export const minecraftCommand = Composer.optional(hasGroupFlags(groupFlags.feature.minecraft), Composer.command("minecraft", (ctx) => {
	getVariable("minecraft:ip").then(ip=>{
		getVariable("minecraft:port").then(port=>{
			let promise = MinecraftServerListPing.ping(4, ip, port, 3000);
			promise.then(response => {
				let txt = "";
				let sample = response.players.sample;
				if (sample != null) {
					for (let i = 0; i < sample.length; i++) {
						txt = txt + "\n" + sample[i].name;
					}
				}
				ctx.replyWithHTML("<b>" + response.description.text + "</b>\nMinecraft <i>" + response.version.name + "</i> (" + response.players.online + "/" + response.players.max + ")\n<u>Spieler:</u>"+ txt);
			}).catch((err) => console.error(err));
		})
	})
	
}))