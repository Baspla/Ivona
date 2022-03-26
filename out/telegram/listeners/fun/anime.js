"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupAnime = void 0;
const jikan_node_1 = __importDefault(require("jikan-node"));
const mal = new jikan_node_1.default();
const utils_js_1 = __importDefault(require("../../utils/utils.js"));
function setupAnime(bot) {
    bot.hears(/\[\[.+]]/, (ctx, next) => {
        if (utils_js_1.default.isGroupChat(ctx.chat.type)) {
            //if (!GroupSetting.isEnabled(constants.settings.features.anime)) return next();
            const names = ctx.message.text.match(/\[\[(.*?)]]/g);
            for (let i = 0; i < names.length; i++) {
                let name = names[i].split(/[\[\]]/).join("");
                mal.search("anime", name, { limit: 1 })
                    .then(info => {
                    let type = "Anime";
                    if (info.results[0].rated.toLowerCase() === "rx")
                        type = "Hentai";
                    ctx.reply("Hier ist der " + type + " nach dem du gesucht hast: <a href=\"" + info.results[0].url + "\">" + name + "</a>", { parse_mode: "HTML" });
                })
                    .catch(err => console.error("Anime Error: " + err));
            }
        }
        next();
    });
}
exports.setupAnime = setupAnime;
//# sourceMappingURL=anime.js.map