"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupDebug = void 0;
function setupDebug(bot) {
    bot.command("debug", (ctx) => {
        ctx.reply("Telegram Bot läuft");
    });
}
exports.setupDebug = setupDebug;
//# sourceMappingURL=debug.js.map