import {Cards} from 'scryfall-sdk';
import { Composer } from 'telegraf';
import { groupFlags } from '../../../constants/groupFlags.js';
import { hasGroupFlags } from '../../predicates/HasGroupFlags.js';

export { setupMagic };

function setupMagic(bot) {
	bot.optional(hasGroupFlags(groupFlags.feature.magic),Composer.optional(hasGroupFlags(groupFlags.feature.magic),
	Composer.hears(/\(\(.+\)\)/, (ctx, next) => {
		const names = ctx.message.text.match(/\(\((.*?)\)\)/g);
		if (names.length >= 4) {
			ctx.reply("Bitte suche nach weniger als 4 Karten pro Nachricht");
			return;
		}
		for (let i = 0; i < names.length; i++) {
			let name = names[i].split(/[)(]/).join("");
			let small = true;
			if (name.startsWith("+")) {
				small = false;
				name = name.substring(1);
			}
			Cards.search("include:extras (lang:de or lang:en) !\"" + name + "\"").on("data", card => {
				const link = (small) ? card.scryfall_uri : card.image_uris.normal;
				if (card.prices.eur != null) {
					ctx.reply("Hier ist die Karte nach der du gesucht hast: <a href=\"" + link + "\">" + card.name + "</a>\nIhr Preis liegt bei " + card.prices.eur + "€", { parse_mode: "HTML" });

				} else {
					ctx.reply("Hier ist die Karte nach der du gesucht hast: <a href=\"" + link + "\">" + card.name + "</a>\nEin Preis konnte nicht ermittelt werden.", { parse_mode: "HTML" });

				}
			});
		}
		next();
	})))
}
