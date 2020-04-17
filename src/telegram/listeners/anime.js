const Jikan = require('jikan-node');
const mal = new Jikan();
const utils = require("../utils/utils");
const features = require("../utils/features");

exports.setupAnime = setupAnime;

function setupAnime(bot) {
    bot.hears(/\[\[.+]]/, (ctx, next) => {
        if (utils.isGroupChat(ctx.chat.type)) {
            const group = db.getGroupByTGID(ctx.chat.id);
            if (group !== undefined) {
                if (!db.hasGroupFeature(group.id, features.anime)) return next();
                const names = ctx.message.text.match(/\[\[(.*?)]]/g);
                for (let i = 0; i < names.length; i++) {
                    let name = names[i].split(/[\[\]]/).join("");
                    mal.search("anime", name, {limit: 1})
                        .then(info => {
                            let type = "Anime";
                            if (info.results[0].rated.toLowerCase() === "rx")
                                type = "Hentai";
                            ctx.reply("Hier ist der " + type + " nach dem du gesucht hast: <a href=\"" + info.results[0].url + "\">" + name + "</a>", {parse_mode: "HTML"})
                        })
                        .catch(err => console.log(err));
                }
            }
        }
        next();
    })
}