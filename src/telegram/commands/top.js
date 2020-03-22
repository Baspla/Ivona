const db = require("../../data/db");
const levelmanager = require("../utils/levels");

exports.setupTop = setupTop;

function setupTop(bot) {
    bot.command('top', (ctx) => {
        let rows = db.getTopPoints(10);
        let list = "Top Punkte:\n";
        rows.forEach(v => {
            list += "<code>" + levelmanager.getLevel(v.user_points) + "</code> <b>" + levelmanager.getTitel(levelmanager.getLevel(v.user_points)) + "</b> <a href=\"tg://user?id=" + v.user_id + "\">" + v.user_name + "</a> (" + v.user_points + "/" + levelmanager.getPointGoal(levelmanager.getLevel(v.user_points)) + ")\n";
        });
        ctx.reply(list, {parse_mode: "HTML"})
    });
}
