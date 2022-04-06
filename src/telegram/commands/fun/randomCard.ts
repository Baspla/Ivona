import scry from 'scryfall-sdk';
import * as constants from '../../../constants.js';
import { groupFlags } from '../../../constants/groupFlags.js';
import { hasGroupFlags } from '../../predicates/HasGroupFlags.js';

export const cardCommand = Composer.optional(hasGroupFlags(groupFlags.feature.magic), Composer.command("card", (ctx) => {
	scry.Cards.random().then(card => {
		ctx.reply("Hier ist eine zufällige Karte: <a href=\"" + card.image_uris.normal + "\">" + card.name + "</a>\n", { parse_mode: "HTML" });
	})
}))