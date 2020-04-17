const db = require("../../data/db");
const levelmanager = require("../utils/levels");
const Location = require("../utils/checks/location");

exports.setupTop = setupTop;

function setupTop(bot) {
    bot.command('top',Location.Group, (ctx) => {
        let rows = db.getUsersOrderedByPoints(db.getGroupByTGID(ctx.chat.id).id,10,0);
        let list = "Top Punkte:\n";

        rows.forEach(v => {
            list += "<code>" + levelmanager.getLevel(v.points) + "</code> <b>" + levelmanager.getTitel(levelmanager.getLevel(v.points)) + "</b> <a href=\"tg://user?id=" + v.tgid + "\">" + v.name + "</a> (" + v.points + "/" + levelmanager.getPointGoal(levelmanager.getLevel(v.points)) + ")\n";
        });
        ctx.reply(list, {parse_mode: "HTML",disable_notification:true})
    });
}
