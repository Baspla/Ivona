const scry = require("scryfall-sdk");
const db = require("../../data/db");

exports.dailyCard = dailyCard;

function dailyCard(bot) {
  scry.Cards.random().then(card => {
      db.getAllGroupsQuery().forEach((item, i) => {
          //Geht das? 👇
        bot.telegram.sendMessage(item.group_id,"Die Karte des Tages ist: <a href=\"" + card.image_uris.normal + "\">" + card.name + "</a>\n", {parse_mode: "HTML"});
      });
  });
}
