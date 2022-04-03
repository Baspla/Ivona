import { Composer } from 'telegraf';
import { getGroupFlags, removeGroupFlag, setGroupFlag, setUserFlags } from '../../../data/data.js';
import utils, { errorHandler } from '../../utils/utils.js';

export const featureCommand = Composer.command("feature", (ctx) => {
    let args = ctx.update.message.text.split(' ');
    if (args.length < 2) {
        ctx.reply("set <feature> | rem <feature> | get <feature> | list")
        return
    }
    let feature = args[2];
    switch (args[1]) {
        case undefined:
            break;

        case "set":
            if (args.length < 3) {
                ctx.reply("Kein Feature angegeben")
                return;
            }
            setGroupFlag(ctx.chat.id, "feature." + feature);
            ctx.reply("Feature aktiviert")
            break;
        case "rem":
            if (args.length < 3) {
                ctx.reply("Kein Feature angegeben")
                return;
            }
            removeGroupFlag(ctx.chat.id, "feature." + feature);
            ctx.reply("Feature entfernt")
            break;
        case "get":
            if (args.length < 3) {
                ctx.reply("Kein Feature angegeben")
                return;
            }
            getGroupFlags(ctx.chat.id).then((flags) => {
                ctx.reply("Das Feature " + args[2] + " ist " +
                    (flags.find((flag) => flag == "feature." + args[2]) == undefined ? "nicht" : "")
                    + " aktiviert.")
            }, errorHandler)
            break;

        case "list":
            getGroupFlags(ctx.chat.id).then((flags) => {
                ctx.reply("Gruppen Features:\n" + flags.filter((value) => value.startsWith("feature.")).map((value) => value.substring(8)).join("\n"));
            }, errorHandler)
            break;

        default:
            ctx.reply("set <feature> | rem <feature> | get <feature> | list")
            break;
    }
});