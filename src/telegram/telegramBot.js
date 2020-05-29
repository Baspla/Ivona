const schedule = require('node-schedule');
const Telegraf = require('telegraf');
const bot = new Telegraf(process.env.BOT_TOKEN);
module.exports.bot=bot;
const {performance} = require("perf_hooks");
const utils = require("./utils/utils");
const roles = require("./utils/roles");
let db = require("../data/db");
const https = require("https");
const {setupMc} = require("./commands/mc");
const {steamTest} = require("./scheduledTasks/steamTest");
const {setupFeatures} = require("./commands/features");
const {setupFeature} = require("./commands/feature");
const {setupIp} = require("./commands/ip");
const {setupCode} = require("./commands/code");
const {setupBackup} = require("./commands/backup");
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
const {setupRegister} = require("./commands/register");
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
const {setupRandomCard} = require("./commands/randomCard");
const {dailyCard} = require("./scheduledTasks/dailyCard");
bot.use((ctx, next) => {
    let start = performance.now()
    let r = next();
    console.log("Der Request hat ", performance.now() - start, " Millisekunden zum Bearbeiten gebraucht.");
    return r;
})

setupVersion(bot);

/** ctx.args hinzufügen */
bot.use((ctx, next) => {
    if (ctx.from !== undefined) {
        if (db.getUserByTGID(ctx.from.id) === undefined) {
            try {
                db.createUser(ctx.from.id, ctx.from.first_name);
            } catch (e) {
                ctx.reply("Fehler: " + e);
                return;
            }
        }
        if (ctx.message !== undefined) {
            if (ctx.message.text !== undefined) {
                const args = ctx.message.text.split(" ");
                args.shift();
                ctx.args = args;
            }
        }
        return next();
    } else {
        console.log("Kein from bei:" + ctx);
    }
});

setupClaim(bot);
setupRegister(bot);

setupStart(bot);
// Weiter gehts nur für User und registeriete Gruppen
bot.use((ctx, next) => {
    let user = db.getUserByTGID(ctx.from.id);
    if (ctx.chat === undefined) {
        return next();
    }
    if (utils.isGroupChat(ctx.chat.type)) {
        let group = db.getGroupByTGID(ctx.chat.id);
        if (group !== undefined) {
            if (!db.hasUserGroup(user.id, group.id))
                db.addUserGroup(user.id, group.id);
            return next();
        }
    } else if (db.getUserGroups(user.id).length > 0) {
        return next();
    } else {
        ctx.reply("Ich habe dich bisher in keiner autorisierten Gruppe schreiben sehen. Ich kann dir leider noch nicht vertrauen.");
    }
});

setupReload(bot);
setupRestart(bot);
setupBackup(bot);
setupAdmin(bot);
setupMod(bot);
setupCoder(bot);
setupFeature(bot);
setupFeatures(bot);
setupDebug(bot);
setupCode(bot);
setupIp(bot);
setupMc(bot);
setupUserlist(bot);
setupToken(bot);
setupTokenCallback(bot);
setupCodeInline(bot);

setupAnime(bot);
setupMagic(bot);
setupRandomCard(bot);

setupHelp(bot);
setupQuote(bot);
setupTop(bot);
setupEhre(bot);
setupStats(bot);

setupPoints(bot);
setupVote(bot);

setupJustThings(bot);
bot.command("trigger", (ctx, next) => {
    if (db.hasUserRole(db.getUserByTGID(ctx.from.id).id, roles.admin))
        steamTest(bot);
    return next();
});
const daily = schedule.scheduleJob('0 9 * * *', function () {
    //console.log('daily executed');
    dailyCard(bot);
});
const hourly = schedule.scheduleJob('0 */1 * * *', function () {
    //console.log('hourly executed');
    if (process.env.DYNDNS_URL !== undefined)
        https.get(process.env.DYNDNS_URL);
});
const minute = schedule.scheduleJob('*/30 * * * *', function () {
    //console.log('minute executed');
    if (0 === Math.floor(Math.random() * Math.floor(11)))
        steamTest(bot);
});
bot.launch().then(() => console.log("Bot gestartet"));
