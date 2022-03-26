/*import scry from 'scryfall-sdk';
import * as constants from '../../constants.js';

export {dailyCard};

function dailyCard(bot) {

    scry.Cards.random().then(card => {
            db.getGroups().forEach((g) => {
                if (db.getGroupSetting(g.id, constants.settings.features.magicDaily) === constants.boolean.true)
                    bot.telegram.sendMessage(g.tgid, "Die Karte des Tages ist: <a href=\"" + card.image_uris.normal + "\">" + card.name + "</a>\n", {parse_mode: "HTML"});
            });
        }
    );
}*/
