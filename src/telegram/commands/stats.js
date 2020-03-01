const db = require("../../data/db");

exports.setupStats = setupStats;

function setupStats(bot) {
    bot.command('stats', (ctx) => {
        const row = db.getUserWithRoles();
        ctx.reply(row.user_name + "\nPunkte: " + row.user_points + "\nEhre: " + row.user_karma + "\nRollen: " + row.roles);
    });
}