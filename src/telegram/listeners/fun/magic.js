import scry from 'scryfall-sdk';
import utils from '../utils/utils.js';
import * as GroupSetting from '../utils/checks/groupsetting.js';
import * as constants from '../../constants.js';

export { setupMagic };

function setupMagic(bot) {
	bot.hears(/\(\(.+\)\)/, (ctx, next) => {
		if (utils.isGroupChat(ctx.chat.type)) {
			if (!GroupSetting.isEnabled(constants.settings.features.magic)) return next();
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
					name = name.substr(1);
				}
				scry.Cards.search("include:extras (lang:de or lang:en) !\"" + name + "\"").on("data", card => {
					const link = (small) ? card.scryfall_uri : card.image_uris.normal;
					if (card.prices.eur != null) {
						ctx.reply("Hier ist die Karte nach der du gesucht hast: <a href=\"" + link + "\">" + card.name + "</a>\nIhr Preis liegt bei " + card.prices.eur + "€", {parse_mode: "HTML"});

					} else {
						ctx.reply("Hier ist die Karte nach der du gesucht hast: <a href=\"" + link + "\">" + card.name + "</a>\nEin Preis konnte nicht ermittelt werden.", {parse_mode: "HTML"});

					}
				});
			}
		}
		next();
	});
}
