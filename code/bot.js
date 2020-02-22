const Telegraf = require('telegraf'); //https://telegraf.js.org/#/?id=sendmessage
//const TelegrafI18n = require('telegraf-i18n') //https://github.com/telegraf/telegraf-i18n
const bot = new Telegraf(process.env.BOT_TOKEN);
const shell = require('shelljs');
const anime = require("./anime");
const utils = require("./utils");
const levelmanager = require("./levels");
const justThings = require("./justThings");
db = require("./db.js");

let userMemMap = {};

// User wird erstellt, falls nicht vorhanden
bot.use((ctx, next) => {
    db.insertUserIfNotExists(ctx.from, 0, 0);
    next();
});
bot.use((ctx, next) => {
    const user = db.getUser(ctx.from.id);
    if (user !== undefined) {
        if (userMemMap[user.id] === undefined) {
            epoch = new Date(0);
            userMemMap[user.id] = {lastUp: epoch, lastDown: epoch, lastSuper: epoch, lastReward: epoch}
        }
        if (utils.isGroup(ctx.chat.type)) {
            let now = new Date();
            if (now.getTime() - userMemMap[user.id].lastReward.getTime() > 180000) { //3 Minuten
                userMemMap[user.id].lastReward = now;
                db.addPoints(user.id, Math.floor(Math.random() * 12) + 1);
            }
        }
    }
    next();
});

/** Super Ehren */
bot.hears(/^(\u2764\ufe0f|\ud83d\udc96|\ud83e\udde1|\ud83d\udc9b|\ud83d\udc9a|\ud83d\udc99|\ud83d\udc9c|\ud83d\udda4).*|.*(\u2764\ufe0f|\ud83d\udc96|\ud83e\udde1|\ud83d\udc9b|\ud83d\udc9a|\ud83d\udc99|\ud83d\udc9c|\ud83d\udda4)$/, (ctx, next) => {
    if (utils.isReply(ctx) && utils.isGroup(ctx.chat.type)) {
        console.log("Super");
        if (ctx.message.reply_to_message.from !== undefined && !ctx.message.reply_to_message.from.is_bot) {
            db.insertUserIfNotExists(ctx.message.reply_to_message.from, 0, 0);
            let now = new Date();
            if (now.getTime() - userMemMap[ctx.from.id].lastSuper.getTime() > 180000) { //3 Minuten
                userMemMap[ctx.from.id].lastSuper = now;
                ctx.reply(ctx.from.id + " super-ehrt " + ctx.message.reply_to_message.from.id);
                db.addKarma(ctx.message.reply_to_message.from.id, 3);
            }
        }
    }
    next();
});

/** Ehren */
bot.hears(/^(\u002b|\u261d|\ud83d\udc46|\ud83d\udc4f|\ud83d\ude18|\ud83d\ude0d|\ud83d\udc4c|\ud83d\udc4d|\ud83d\ude38).*|.*(\u002b|\u261d|\ud83d\udc46|\ud83d\udc4f|\ud83d\ude18|\ud83d\ude0d|\ud83d\udc4c|\ud83d\udc4d|\ud83d\ude38)$/, (ctx, next) => {
    if (utils.isReply(ctx) && utils.isGroup(ctx.chat.type)) {
        console.log("Upvote");
        if (ctx.message.reply_to_message.from !== undefined && !ctx.message.reply_to_message.from.is_bot) {
            db.insertUserIfNotExists(ctx.message.reply_to_message.from, 0, 0);
            let now = new Date();
            if (now.getTime() - userMemMap[ctx.from.id].lastUp.getTime() > 180000) { //3 Minuten
                userMemMap[ctx.from.id].lastUp = now;
                ctx.reply(ctx.from.id + " ehrt " + ctx.message.reply_to_message.from.id);
                db.addKarma(ctx.message.reply_to_message.from.id, 1);
            }
        }
    }
    next();
})
/** Entehren */
bot.hears(/^(\u2639\ufe0f|\ud83d\ude20|\ud83d\ude21|\ud83e\udd2c|\ud83e\udd2e|\ud83d\udca9|\ud83d\ude3e|\ud83d\udc4e|\ud83d\udc47).*|.*(\u2639\ufe0f|\ud83d\ude20|\ud83d\ude21|\ud83e\udd2c|\ud83e\udd2e|\ud83d\udca9|\ud83d\ude3e|\ud83d\udc4e|\ud83d\udc47)$/, (ctx, next) => {
    if (utils.isReply(ctx) && utils.isGroup(ctx.chat.type)) {
        console.log("Downvote");
        if (ctx.message.reply_to_message.from !== undefined && !ctx.message.reply_to_message.from.is_bot) {
            db.insertUserIfNotExists(ctx.message.reply_to_message.from, 0, 0);
            let now = new Date();
            if (now.getTime() - userMemMap[ctx.from.id].lastDown.getTime() > 180000) { //3 Minuten
                userMemMap[ctx.from.id].lastDown = now;
                ctx.reply(ctx.from.id + " entehrt " + ctx.message.reply_to_message.from.id);
                db.removeKarma(ctx.message.reply_to_message.from.id, 1);
            }
        }
    }
    next();
})


/** /start Befehl */
bot.start((ctx) => ctx.replyWithPhoto({source: 'resources/profile.jpg'}, {caption: "Hi, Ich bin Ivona.\nIch bin hier um dir zu Helfen."}));

/** /help Befehl */
bot.help((ctx) => ctx.reply('Hilfe'));

/** Kevins Anime Suche */
anime.command(bot);

/** Punkte Scoreboard Befehl */
bot.command('top', (ctx) => {
    let rows = db.getTopPoints(10)
    var list = "Top Punkte:\n";
    rows.forEach(v => {
        list += "<code>" + levelmanager.getLevel(v.points) + "</code> <b>" + levelmanager.getTitel(levelmanager.getLevel(v.points)) + "</b> <a href=\"tg://user?id=" + v.id + "\">" + v.username + "</a> (" + v.points + "/" + levelmanager.getPointGoal(levelmanager.getLevel(v.points)) + ")\n";
    });
    ctx.reply(list, {parse_mode: "HTML"})
});

bot.command('restart', (ctx) => {
    if (utils.isCreator(ctx.from.id)) {
        ctx.reply("Starte neu...")
        shell.exec('../restart.sh');
    } else {
        ctx.reply("Du hast keine Berechtigung dazu.");
    }
})

/** Karma Scoreboard Befehl */
bot.command('ehre', (ctx) => {
    let rows = db.getTopKarma(10)
    var list = "Top Ehre:\n";
    rows.forEach(v => {
        list += "<code>" + v.karma + " Ehre</code> - <a href=\"tg://user?id=" + v.id + "\">" + v.username + "</a>\n";
    });
    ctx.reply(list, {parse_mode: "HTML"})
});

/** Debug Punkte + Befehl */
bot.command('cheat', (ctx) => {
    ctx.reply("Füge 100 Punkte hinzu.")
    db.addPoints(ctx.from.id, 100);
});

/** Befehl zum Anzeigen der Statistik eines Nutzers */
bot.command('stats', (ctx) => {
    ctx.reply('ToDo Stats')
});

/** JustThings Bildgenerator */
bot.hears(/^((wenn)|(when)) /i, (ctx) => {
    //if (utils.isGroup(ctx.chat.type)){
    justThings.generateImage(ctx.message.text, ctx.from.first_name);
    ctx.replyWithPhoto({source: "resources/temp/justThings.png"});
});

bot.launch();

function checkLevelUp(ctx, user, previous) {
    db.get(querys.getUser, user.id, (err, row) => {
        if (err) {
            throw err;
        }
        if (row !== undefined) {
            let levelNow = levelmanager.getLevel(row.points);
            let levelPrev = levelmanager.getLevel(previous);
            let dist = levelNow - levelPrev;
            if (dist === 1) {
                ctx.replyWithPhoto("smug.moe/smg/" + levelNow + ".png", {caption: user.username + " ist jetzt ein " + levelmanager.getTitel(levelNow)});
            } else if (dist > 1) {
                ctx.replyWithPhoto("smug.moe/smg/" + levelNow + ".png", {caption: user.username + " ist jetzt ein " + levelmanager.getTitel(levelNow) + " und hat " + (dist - 1) + " Level übersprungen"});
            }
        }
    });
}