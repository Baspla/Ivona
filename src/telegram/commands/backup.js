const db = require("../../data/db");
const Auth = require("../utils/checks/authentication");
const Location = require("../utils/checks/location");
const roles = require("../utils/roles");

exports.setupBackup = setupBackup;

function setupBackup(bot) {
    bot.command('backup', Auth.roleRequired(roles.admin),Location.User,(ctx) => {
        const filename=`resources/backup.db`;
        ctx.reply("Starte Backup");
        console.log("Backup");
        db.backup(filename)
            .then(() => {
                console.log("Backup an "+ctx.from.id+" gesendet");
                ctx.replyWithDocument({source:filename});
            })
            .catch((err) => {
                ctx.reply("Backup fehlgeschlagen.\n\n"+err);
            });
    });
}