const Telegraf = require('telegraf');
const bot = new Telegraf(process.env.BOT_TOKEN);
bot.userMemMap={};
const utils = require("./utils/utils");
const roles = require("./utils/roles");
const db = require("../data/db");
const {setupDebug} = require("./commands/debug");
const {setupCodeInline} = require("./listeners/codeInline");
const {setupJustThings} = require("./listeners/justThings");
const {setupVote} = require("./listeners/vote");
const {setupPoints} = require("./listeners/points");
const {setupStats} = require("./commands/stats");
const {setupEhre} = require("./commands/ehre");
const {setupTop} = require("./commands/top");
const {setupTokenCallback} = require("./listeners/tokenCallback");
const {setupQuote} = require("./commands/quote");
const {setupClaim} = require("./commands/claim");
const {setupReload} = require("./commands/reload");
const {setupRegisterGroup} = require("./commands/registerGroup");
const {setupToken} = require("./commands/token");
const {setupUserlist} = require("./commands/userlist");
const {setupCoder} = require("./commands/coder");
const {setupMod} = require("./commands/mod");
const {setupAdmin} = require("./commands/admin");
const {setupStart} = require("./commands/start");
const {setupVersion} = require("./commands/version");
const {setupHelp} = require("./commands/help");
const {setupRestart} = require("./commands/restart");
const {setupAnime} = require("./listeners/anime");
const {setupMagic} = require("./listeners/magic");

/** ctx.args hinzufügen */
bot.use((ctx, next) => {
    if (ctx.message !== undefined) {
        if (ctx.message.text !== undefined) {
            const args = ctx.message.text.split(" ");
            args.shift();
            ctx.args = args;
        }
    }
    next();
});

setupClaim(bot);
setupRegisterGroup(bot);

setupStart(bot);
setupHelp(bot);
setupVersion(bot);

/** Erstelle user und überprüfe ob sie die Rolle user haben (sind in Gruppe) */
bot.use((ctx, next) => {
    db.insertUserIfNotExists(ctx.from, 0, 0);
    if (db.hasUserRole(ctx.from.id, roles.user)) {
        return next();
    } else {
        if (utils.isGroupChat(ctx.chat.type)) {
            if (db.isRegisteredGroup(ctx.chat.id)) {
                db.insertUserRole(ctx.from.id, roles.user);
                next();
            }
        } else {
            ctx.reply("Ich habe dich bisher in keiner Gruppe schreiben sehen. Ich kann dir leider noch nicht vertrauen.");
        }
    }
});

setupReload(bot);
setupRestart(bot);
setupAdmin(bot);
setupMod(bot);
setupCoder(bot);
setupDebug(bot);
setupUserlist(bot);
setupToken(bot);
setupTokenCallback(bot);

setupCodeInline(bot);

setupAnime(bot);
setupMagic(bot);

setupQuote(bot);
setupTop(bot);
setupEhre(bot);
setupStats(bot);

setupPoints(bot);
setupVote(bot);

setupJustThings(bot);

bot.launch().then(() => console.log("Bot gestartet"));