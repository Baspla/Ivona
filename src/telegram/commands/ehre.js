const db = require("../../data/db");
const Location = require("../utils/checks/location");
const Feature = require("../utils/checks/feature");
const features = require("../utils/features");
exports.setupEhre = setupEhre;

function setupEhre(bot) {
    bot.command('ehre',Feature.hasFeature(features.karma),Location.Group, (ctx) => {
        let rows = db.getUsersOrderedByKarma(db.getGroupByTGID(ctx.chat.id).id,10,0);
        let list = "Top Ehre:\n";
        rows.forEach(v => {
            list += "<code>" + v.karma + " Ehre</code> - <a href=\"tg://user?id=" + v.tgid + "\">" + v.name + "</a>\n";
        });
        ctx.reply(list, {parse_mode: "HTML",disable_notification:true})
    });
}