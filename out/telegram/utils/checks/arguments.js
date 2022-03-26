"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.minArgs = void 0;
const minArgs = (min) => {
    return (ctx, next) => {
        if (ctx.args !== undefined) {
            if (ctx.args.length >= min) {
                next();
            }
            else {
                if (min === 1) {
                    ctx.reply("Dieser Befehl benötigt mindestens " + min + " Argument.");
                }
                else
                    ctx.reply("Dieser Befehl benötigt mindestens " + min + " Argumente.");
            }
        }
        else
            next();
    };
};
exports.minArgs = minArgs;
//# sourceMappingURL=arguments.js.map