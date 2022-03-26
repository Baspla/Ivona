import scry from 'scryfall-sdk';
import * as GroupSetting from '../../utils/checks/groupsetting.js';
import * as constants from '../../../constants.js';

export { setupRandomCard };

function setupRandomCard(bot) {
	bot.command("randomCard",GroupSetting.isEnabled(constants.settings.features.magic), (ctx) => {
		scry.Cards.random().then(card => {
			ctx.reply("Hier ist eine zufällige Karte: <a href=\"" + card.image_uris.normal + "\">" + card.name + "</a>\n", {parse_mode: "HTML"});
		});
	});
}