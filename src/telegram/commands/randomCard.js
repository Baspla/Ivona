const scry = require("scryfall-sdk");

exports.setupRandomCard = this.setupRandomCard;

function setupRandomCard(bot) {
    bot.command("randomCard", (ctx) => {
        scry.Cards.random().then(card => {
            ctx.reply("Hier ist eine zufällige Karte: <a href=\"" + card.image_uris.small + "\">" + card.name + "</a>\n");
        });
    });
}