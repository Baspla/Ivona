const scry = require("scryfall-sdk");
const utils = require("./utils");

exports.command = command;

function command(bot) {
    bot.hears(/\(\(.+\)\)/, (ctx,next) => {
        if (utils.isGroup(ctx.chat.type)) {
            const names = ctx.message.text.match(/\(\((.*?)\)\)/g);
            if (names.length >= 4) {
                ctx.reply("Bitte suche nach weniger als 4 Karten pro Nachricht");
                return;
            }
            for (let i = 0; i < names.length; i++) {
                let name = names[i].split(/[)(]/).join("");
                scry.Cards.search("include:extras (lang:de or lang:en) !\"" + name + "\"").on("data", card => {
                    if (card.prices.eur != null) {
                        ctx.reply("Hier ist die Karte nach der du gesucht hast: <a href=\"" + card.image_uris.normal + "\">" + card.name + "</a>\nIhr Preis liegt bei " + card.prices.eur + "€", {parse_mode: "HTML"});

                    } else {
                        ctx.reply("Hier ist die Karte nach der du gesucht hast: <a href=\"" + card.image_uris.normal + "\">" + card.name + "</a>\nEin Preis konnte nicht ermittelt werden.", {parse_mode: "HTML"});

                    }
                });
            }
        }
        next();
    })
}
