"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupVersion = void 0;
function setupVersion(bot) {
    bot.command("version", (ctx) => {
        ctx.reply("Ich laufe auf Version <code> 2.0.0 dev </code>", { parse_mode: "HTML" });
    });
}
exports.setupVersion = setupVersion;
//# sourceMappingURL=version.js.map