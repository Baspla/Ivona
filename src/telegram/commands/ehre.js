const db = require("../../data/db");

exports.setupEhre = setupEhre;

function setupEhre(bot) {
    bot.command('ehre', (ctx) => {
        let rows = db.getTopKarma(10);
        let list = "Top Ehre:\n";
        rows.forEach(v => {
            list += "<code>" + v.user_karma + " Ehre</code> - <a href=\"tg://user?id=" + v.user_id + "\">" + v.user_name + "</a>\n";
        });
        ctx.reply(list, {parse_mode: "HTML"})
    });
}