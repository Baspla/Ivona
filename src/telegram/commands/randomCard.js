const scry = require("scryfall-sdk");

exports.setupRandomCard = setupRandomCard;

function setupRandomCard(bot) {
    bot.command("randomCard", (ctx) => {
        scry.Cards.random().then(card => {
            ctx.reply("Hier ist eine zufällige Karte: <a href=\"" + card.image_uris.normal + "\">" + card.name + "</a>\n", {parse_mode: "HTML"});
        });
    });
}