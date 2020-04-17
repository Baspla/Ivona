const db = require("../../data/db");

exports.setupStats = setupStats;

function setupStats(bot) {
    bot.command('stats', (ctx) => {
        const user = db.getUserByTGID(ctx.from.id);
        let txt="";
        db.getUserGroups(user.id).forEach((row) => {
            group=db.getGroup(row.groupId);
            txt = txt+"<b>"+ group.name+"</b>\nPunkte: " + row.points + "\nEhre: " + row.karma+"\n\n";
        });
        ctx.replyWithHTML("Name: "+user.name +"\n\n"+txt);
    });
}