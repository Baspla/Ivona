"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupRestart = void 0;
const shelljs_1 = __importDefault(require("shelljs"));
let restartProtection = 0;
function setupRestart(bot) {
    bot.command("restart", (ctx) => {
        if (restartProtection <= 0) {
            ctx.reply("Restart Protection\nGib noch ein mal /restart ein");
            restartProtection++;
        }
        else {
            ctx.reply("Starte neu...");
            shelljs_1.default.exec("../restart.sh");
        }
    });
}
exports.setupRestart = setupRestart;
//# sourceMappingURL=restart.js.map