const db = require("../../data/db");
const Auth = require("../utils/checks/authentication");
const Args = require("../utils/checks/arguments");
const roles = require("../utils/roles");

exports.setupCode = setupCode;

function setupCode(bot) {
    bot.command('code', Args.minimumArgs(2), Auth.roleRequired(roles.coder), (ctx) => {
        const code = ctx.args.shift();
        const description = ctx.args.join(" ");
        if (db.getCodeByCode(code) === undefined) {
            db.insertCode(code, description, ctx.from.user_id);
            ctx.reply("Code "+code+" erstellt");
        }else{
            ctx.reply("Dieser Code exisitert schon");
        }
    });
}