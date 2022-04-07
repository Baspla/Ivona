import { Composer } from 'telegraf';
import { delVariable, getGroupFlags, getVariable, removeGroupFlag, setGroupFlag, setUserFlags, setVariable } from '../../../data/data.js';
import utils, { errorHandler } from '../../utils/utils.js';

export const varCommand = Composer.command("var", (ctx) => {
    let args = ctx.update.message.text.split(' ');
    if (args.length < 2) {
        ctx.reply("set <var> <value> | rem <var> | get <var>")
        return
    }
    let variable = args[2];
    switch (args[1]) {
        case undefined:
            break;

        case "set":
            if (args.length < 3) {
                ctx.reply("Keine Variable angegeben")
                return;
            }
            if (args.length < 4) {
                ctx.reply("Keinen Wert angegeben")
                return;
            }
            setVariable(variable,args[3]);
            ctx.reply("Variable "+variable+" auf "+args[3]+"gesetzt")
            break;
        case "rem":
            if (args.length < 3) {
                ctx.reply("Kein Variable angegeben")
                return;
            }
            delVariable(variable);
            ctx.reply("Variable entfernt")
            break;
        case "get":
            if (args.length < 3) {
                ctx.reply("Keine Variable angegeben")
                return;
            }
            getVariable(variable).then((value) => {
                ctx.reply("Die Variable " + args[2] + " ist auf " +value+" gesetzt");
            }, errorHandler)
            break;

        default:
            ctx.reply("set <feature> | rem <feature> | get <feature>")
            break;
    }
});