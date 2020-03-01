const roles = require("../utils/roles");
const Location = require("../utils/LocationCheck");
const utils = require("../utils/utils");
exports.setupHelp = setupHelp;

const tail = "\n/version";
const head = "Das sind alle Befehle, die ich dir anbieten kann\n";


function setupHelp(bot) {
    bot.help(Location.User, (ctx) => {
        let txt = head;
        if (db.hasUserRole(ctx.from.id, roles.user)) {
            txt += "\nUser-Befehle:\n" +
                "/quote - Zufälliges Zitat\n" +
                "/top - Top 10 Punktesammler\n" +
                "/ehre - Top 10 Ehrenmänner\n" +
                "/stats - deine Stats\n";
        }
        if (db.hasUserRole(ctx.from.id, roles.coder)) {
            txt += "\nCoder-Befehle:\n" +
                "/token - zeigt deinen API-Token an\n";
        }
        if (db.hasUserRole(ctx.from.id, roles.moderator)) {
            txt += "\nMod-Befehle:\n" +
                "/reload - läd Discord Quote Cache neu\n" +
                "/coder - ändert Coder Rolle für Nutzer\n";
        }
        if (db.hasUserRole(ctx.from.id, roles.admin)) {
            txt += "\nAdmin-Befehle:\n" +
                "/restart - startet den Bot neu\n" +
                "/admin - ändert Admin Rolle für Nutzer\n" +
                "/mod - ändert Mod Rolle für Nutzer\n" +
                "/debug - Status aller Systeme\n" +
                "/userlist - Liste aller Nutzer mit Rollen\n";
        }
        if (utils.isCreator(ctx.from.id)) {
            txt += "\nCreator-Befehle:\n" +
                "/claim - macht dich zum Admin\n" +
                "/registerGroup - registriert die Gruppe\n";
        }
        txt += tail;
        ctx.reply(txt);
    });
}