const Jikan = require('jikan-node');
const mal = new Jikan();
const utils = require("./utils");

exports.command=command;

function command(bot) {
    bot.hears(/\[\[.+]]/, (ctx,next) => {
        if (utils.isGroup(ctx.chat.type)) {
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
        next();
    })
}