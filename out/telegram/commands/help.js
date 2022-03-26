"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupHelp = void 0;
const tail = "\n/version";
const head = "Das sind alle Befehle, die ich dir anbieten kann\n";
function setupHelp(bot) {
    bot.help((ctx) => {
        let txt = head;
        txt += "\nUser-Befehle:\n" +
            "/quote - Zufälliges Zitat\n" +
            "/top - Top 10 Punktesammler\n" +
            "/ehre - Top 10 Ehrenmänner\n" +
            "/stats - deine Stats\n";
        txt += tail;
        ctx.reply(txt);
    });
}
exports.setupHelp = setupHelp;
//# sourceMappingURL=help.js.map