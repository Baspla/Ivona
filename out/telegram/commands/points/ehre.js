"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupEhre = void 0;
const data_js_1 = require("../../../data/data.js");
function setupEhre(bot) {
    bot.command("ehre", (ctx) => {
        //let rows = db.getUsersOrderedByTGIDByKarma(ctx.chat.id,10,0);
        (0, data_js_1.getGroupKarmaOrdered)(ctx.chat.id).then((entries) => {
            let list = "Top Ehre:\n";
            Promise.allSettled(entries.map((entry) => {
                return (0, data_js_1.getAlias)(entry.value).then((alias) => {
                    console.log(entry.value);
                    list += "<code>" + entry.score + " Ehre</code> - <a href=\"tg://user?id=" + entry.value + "\">" + alias + "</a>\n";
                });
            })).then(() => {
                ctx.reply(list, { parse_mode: "HTML", disable_notification: true });
                console.log("DONE");
            });
        });
    });
}
exports.setupEhre = setupEhre;
//# sourceMappingURL=ehre.js.map