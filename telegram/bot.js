const Telegraf = require('telegraf'); //https://telegraf.js.org/#/?id=sendmessage
//const TelegrafI18n = require('telegraf-i18n') //https://github.com/telegraf/telegraf-i18n
const bot = new Telegraf(process.env.BOT_TOKEN);
const shell = require('shelljs');
const anime = require("./anime");
const magic = require("./magic");
const utils = require("./utils");
const levelmanager = require("./levels");
const justThings = require("./justThings");
db = require("../data/db");
api = require("../api/server");
const roles = require("./roles");
const Auth = require("./middlewares/AuthenticationMiddleware");
const Command = require("./middlewares/CommandMiddleware");
let userMemMap = {};


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

/** /start Befehl */
bot.start((ctx) => ctx.replyWithPhoto({source: 'resources/profile.jpg'}, {caption: "Hi, Ich bin Ivona.\nIch bin hier um dir zu Helfen."}));

/** /help Befehl */
bot.help((ctx) => ctx.reply('Hilfe'));

/** Kevins Anime Suche */
anime.command(bot);

/** Kevins Magic Suche */
magic.command(bot);

bot.command('registerGroup', (ctx) => {
    if (utils.isCreator(ctx.from.id)) {
        if (utils.isGroup(ctx.chat.type)) {
            if (!db.isRegisteredGroup(ctx.chat.id)) {
                db.insertGroup(ctx.chat.id);
                ctx.reply("Gruppe hinzugefügt.");
            } else ctx.reply("Diese Gruppe ist schon registriert.");
        } else ctx.reply("Das ist keine Gruppe...");
    }
});

// User wird erstellt, falls nicht vorhanden
bot.use((ctx, next) => {
    db.insertUserIfNotExists(ctx.from, 0, 0);
    if (db.hasUserRole(ctx.from.id, roles.user)) {
        return next();
    } else {
        if (utils.isGroup(ctx.chat.type)) {
            if (db.isRegisteredGroup(ctx.chat.id)) {
                db.insertUserRole(ctx.from.id, roles.user);
            }
        } else {
            ctx.reply("Ich habe dich bisher in keiner Gruppe schreiben sehen. Ich kann dir leider noch nicht vertrauen.");
        }
    }
});

/** /restart */
bot.command('restart', Auth.roleRequired(roles.admin), (ctx) => {
    ctx.reply("Starte neu...")
    shell.exec('../restart.sh');
})

/** /admin */
bot.command('admin', Command.minimumArgs(1), Auth.roleRequired("admin"), (ctx) => {
    const name = ctx.args.join(" ");
    const user = db.getUserFromName(name);
    if (user === undefined) {
        ctx.reply("Unbekannter Nutzer");
    } else if (!db.hasUserRole(user.user_id, roles.admin)) {
        db.insertUserRole(user.user_id, roles.admin);
        ctx.reply(user.user_name + " wurde der Administrator Status anerkannt.");
    } else {
        db.deleteUserRole(user.user_id, roles.admin);
        ctx.reply(user.user_name + " wurde der Administrator Status aberkannt.");
    }
});

/** /mod */
bot.command('mod', Command.minimumArgs(1), Auth.roleRequired("admin"), (ctx) => {
    const name = ctx.args.join(" ");
    const user = db.getUserFromName(name);
    if (user === undefined) {
        ctx.reply("Unbekannter Nutzer");
    } else if (!db.hasUserRole(user.user_id, roles.moderator)) {
        db.insertUserRole(user.user_id, roles.moderator);
        ctx.reply(user.user_name + " wurde der Moderator Status anerkannt.");
    } else {
        db.deleteUserRole(user.user_id, roles.moderator);
        ctx.reply(user.user_name + " wurde der Moderator Status aberkannt.");
    }
});

/** /coder */
bot.command('coder', Command.minimumArgs(1), Auth.roleRequired("admin"), (ctx) => {
    const name = ctx.args.join(" ");
    const user = db.getUserFromName(name);
    if (user === undefined) {
        ctx.reply("Unbekannter Nutzer");
    } else if (!db.hasUserRole(user.user_id, roles.coder)) {
        db.insertUserRole(user.user_id, roles.coder);
        ctx.reply(user.user_name + " wurde der Coder Status anerkannt.");
    } else {
        db.deleteUserRole(user.user_id, roles.coder);
        ctx.reply(user.user_name + " wurde der Coder Status aberkannt.");
    }
});

/** /userlist */
bot.command('userlist', Auth.roleRequired("admin"), (ctx) => {
    let text = "User: \n";
    db.getUsersRoles().forEach((row) => {
        text += row.user_name + " - Rollen: " + row.roles + "\n";
    })
    ctx.reply(text);
});

/** /claim */
bot.command('claim', (ctx) => {
    if (utils.isCreator(ctx.from.id)) {
        if (!db.hasUserRole(ctx.from.id, roles.admin)) {
            ctx.reply("Du bist jetzt Admin.");
            db.insertUserRole(ctx.from.id, roles.admin);
        } else {
            ctx.reply("Du bist schon Admin.");
        }
    }
});

/** Punkte Scoreboard Befehl */
bot.command('top', (ctx) => {
    let rows = db.getTopPoints(10)
    var list = "Top Punkte:\n";
    rows.forEach(v => {
        list += "<code>" + levelmanager.getLevel(v.user_points) + "</code> <b>" + levelmanager.getTitel(levelmanager.getLevel(v.user_points)) + "</b> <a href=\"tg://user?id=" + v.id + "\">" + v.user_name + "</a> (" + v.user_points + "/" + levelmanager.getPointGoal(levelmanager.getLevel(v.user_points)) + ")\n";
    });
    ctx.reply(list, {parse_mode: "HTML"})
});

/** Karma Scoreboard Befehl */
bot.command('ehre', (ctx) => {
    let rows = db.getTopKarma(10)
    var list = "Top Ehre:\n";
    rows.forEach(v => {
        list += "<code>" + v.user_karma + " Ehre</code> - <a href=\"tg://user?id=" + v.user_id + "\">" + v.user_name + "</a>\n";
    });
    ctx.reply(list, {parse_mode: "HTML"})
});


/** Befehl zum Anzeigen der Statistik eines Nutzers */
bot.command('stats', (ctx) => {
    ctx.reply('ToDo Stats')
    //TODO
});

bot.use((ctx, next) => {
    const user = db.getUser(ctx.from.id);
    if (user !== undefined) {
        if (userMemMap[user.user_id] === undefined) {
            epoch = new Date(0);
            userMemMap[user.user_id] = {lastUp: epoch, lastDown: epoch, lastSuper: epoch, lastReward: epoch}
        }
        if (utils.isGroup(ctx.chat.type)) {
            let now = new Date();
            if (now.getTime() - userMemMap[user.user_id].lastReward.getTime() > 180000) { //3 Minuten
                userMemMap[user.user_id].lastReward = now;

                const previous = user.user_points;
                db.addPoints(user.user_id, Math.floor(Math.random() * 12) + 1);
                checkLevelUp(ctx, ctx.from.id, previous);
            }
        }
    }
    next();
});

/** Super Ehren */
bot.hears(/^(\u2764\ufe0f|\ud83d\udc96|\ud83e\udde1|\ud83d\udc9b|\ud83d\udc9a|\ud83d\udc99|\ud83d\udc9c|\ud83d\udda4).*|.*(\u2764\ufe0f|\ud83d\udc96|\ud83e\udde1|\ud83d\udc9b|\ud83d\udc9a|\ud83d\udc99|\ud83d\udc9c|\ud83d\udda4)$/, (ctx, next) => {
    if (utils.isReply(ctx) && utils.isGroup(ctx.chat.type)) {
        if (ctx.message.reply_to_message.from !== undefined && !ctx.message.reply_to_message.from.is_bot) {
            if (ctx.message.reply_to_message.from.id !== ctx.from.id) {
                db.insertUserIfNotExists(ctx.message.reply_to_message.from, 0, 0);
                let now = new Date();
                if (now.getTime() - userMemMap[ctx.from.id].lastSuper.getTime() > 7200000) { //2 Stunden
                    userMemMap[ctx.from.id].lastSuper = now;
                    ctx.reply(db.getUser(ctx.from.id).user_name + " entehrt " + db.getUser(ctx.message.reply_to_message.from.id).user_name + " absolut hart!");
                    db.addKarma(ctx.message.reply_to_message.from.id, 3);
                }
            }
        }
    }
    next();
});

/** Ehren */
bot.hears(/^(\u002b|\u261d|\ud83d\udc46|\ud83d\udc4f|\ud83d\ude18|\ud83d\ude0d|\ud83d\udc4c|\ud83d\udc4d|\ud83d\ude38).*|.*(\u002b|\u261d|\ud83d\udc46|\ud83d\udc4f|\ud83d\ude18|\ud83d\ude0d|\ud83d\udc4c|\ud83d\udc4d|\ud83d\ude38)$/, (ctx, next) => {
    if (utils.isReply(ctx) && utils.isGroup(ctx.chat.type)) {
        if (ctx.message.reply_to_message.from !== undefined && !ctx.message.reply_to_message.from.is_bot) {
            if (ctx.message.reply_to_message.from.id !== ctx.from.id) {
                db.insertUserIfNotExists(ctx.message.reply_to_message.from, 0, 0);
                let now = new Date();
                if (now.getTime() - userMemMap[ctx.from.id].lastUp.getTime() > 300000) { //5 Minuten
                    userMemMap[ctx.from.id].lastUp = now;
                    ctx.reply(db.getUser(ctx.from.id).user_name + " ehrt " + db.getUser(ctx.message.reply_to_message.from.id).user_name);
                    db.addKarma(ctx.message.reply_to_message.from.id, 1);
                }
            }
        }
    }
    next();
})

/** Entehren */
bot.hears(/^(\u2639\ufe0f|\ud83d\ude20|\ud83d\ude21|\ud83e\udd2c|\ud83e\udd2e|\ud83d\udca9|\ud83d\ude3e|\ud83d\udc4e|\ud83d\udc47).*|.*(\u2639\ufe0f|\ud83d\ude20|\ud83d\ude21|\ud83e\udd2c|\ud83e\udd2e|\ud83d\udca9|\ud83d\ude3e|\ud83d\udc4e|\ud83d\udc47)$/, (ctx, next) => {
    if (utils.isReply(ctx) && utils.isGroup(ctx.chat.type)) {
        if (ctx.message.reply_to_message.from !== undefined && !ctx.message.reply_to_message.from.is_bot) {
            if (ctx.message.reply_to_message.from.id !== ctx.from.id) {
                db.insertUserIfNotExists(ctx.message.reply_to_message.from, 0, 0);
                let now = new Date();
                if (now.getTime() - userMemMap[ctx.from.id].lastDown.getTime() > 600000) { //10 Minuten
                    userMemMap[ctx.from.id].lastDown = now;
                    ctx.reply(db.getUser(ctx.from.id).user_name + " entehrt " + db.getUser(ctx.message.reply_to_message.from.id).user_name);
                    db.removeKarma(ctx.message.reply_to_message.from.id, 1);
                }
            }
        }
    }
    next();
})

/** JustThings Bildgenerator */
bot.hears(/^((wenn)|(when)) /i, (ctx) => {
    //if (utils.isGroup(ctx.chat.type)){
    justThings.generateImage(ctx.message.text, ctx.from.first_name);
    ctx.replyWithPhoto({source: "resources/wip.jpg"});
});

bot.launch();

function checkLevelUp(ctx, id, previous) {
    let user = db.getUser(id);
    if (user !== undefined) {
        let levelNow = levelmanager.getLevel(user.user_points);
        let levelPrev = levelmanager.getLevel(previous);
        let dist = levelNow - levelPrev;
        if (dist === 1) {
            ctx.replyWithPhoto("smug.moe/smg/" + levelNow + ".png", {caption: user.user_name + " ist jetzt ein " + levelmanager.getTitel(levelNow)});
        } else if (dist > 1) {
            ctx.replyWithPhoto("smug.moe/smg/" + levelNow + ".png", {caption: user.user_name + " ist jetzt ein " + levelmanager.getTitel(levelNow) + " und hat " + (dist - 1) + " Level übersprungen"});
        }
    }
}