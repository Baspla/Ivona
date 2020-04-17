const scry = require("scryfall-sdk");
const Feature = require("../utils/checks/feature");
const features = require("../utils/features");

exports.setupRandomCard = setupRandomCard;

function setupRandomCard(bot) {
    bot.command("randomCard",Feature.hasFeature(features.magic), (ctx) => {
        scry.Cards.random().then(card => {
            ctx.reply("Hier ist eine zufällige Karte: <a href=\"" + card.image_uris.normal + "\">" + card.name + "</a>\n", {parse_mode: "HTML"});
        });
    });
}