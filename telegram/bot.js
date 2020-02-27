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
const Location = require("./middlewares/LocationMiddleware");
const Command = require("./middlewares/CommandMiddleware");
let userMemMap = {};
const Markup = require("telegraf/markup");

/** PREP | WICHTIG VOR DEN BEFEHLEN | add ctx.args */
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

/** INLINE QUERYS */
bot.on("inline_query", ((ctx, next) => {
    const result = [];
    let offset = Number(ctx.inlineQuery.offset);
    if (ctx.inlineQuery.query === "") {
        db.getCodes(10, offset).forEach((code) => {
            result.push(new InlineQueryResultArticle(code.code_id, code.code_code, code.code_description, "<b>" + code.code_code + "</b>\n" + code.code_description, "HTML"))
        });
        offset += 10;
    } else {
        const code = db.getCodeByCode(ctx.inlineQuery.query);
        if (code !== undefined)
            result.push(new InlineQueryResultArticle(code.code_id, code.code_code, code.code_description, "<b>" + code.code_code + "</b>\n" + code.code_description, "HTML"))
    }
    if (offset + "" !== ctx.inlineQuery.offset)
        ctx.answerInlineQuery(result, {next_offset: offset + ""})
}));

/** COMMAND | CREATOR | claim */
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

/**  COMMAND | CREATOR | registerGroup */
bot.command('registerGroup', (ctx) => {
    if (utils.isCreator(ctx.from.id)) {
        if (utils.isGroupChat(ctx.chat.type)) {
            if (!db.isRegisteredGroup(ctx.chat.id)) {
                db.insertGroup(ctx.chat.id);
                ctx.reply("Gruppe hinzugefügt.");
            } else ctx.reply("Diese Gruppe ist schon registriert.");
        } else ctx.reply("Das ist keine Gruppe...");
    }
});

/** COMMAND | start */
bot.start((ctx) => ctx.replyWithPhoto({source: 'resources/profile.jpg'}, {caption: "Hi, Ich bin Ivona.\nIch bin hier um dir zu Helfen."}));

/** COMMAND | help */
bot.help((ctx) => ctx.reply('Hilfe'));

/** COMMAND | version */
bot.command('version', (ctx) => {
    ctx.reply("Ich laufe auf Version " + process.env.npm_package_version);
});
/** FEATURE | Kevins Anime Suche */
anime.command(bot);

/** FEATURE | Kevins Magic Suche */
magic.command(bot);

/** PREP | WICHTIG VOR NUTZERABFRAGEN | Erstelle user und überprüfe ob sie die Rolle user haben (sind in Gruppe) */
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

/** COMMAND | ADMIN | restart */
bot.command('restart', Auth.roleRequired(roles.admin), (ctx) => {
    ctx.reply("Starte neu...");
    shell.exec('../restart.sh');
});

/** COMMAND | ADMIN | admin */
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

/** COMMAND | ADMIN | mod */
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

/** COMMAND | ADMIN | coder */
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

/** COMMAND | ADMIN | userlist */
bot.command('userlist', Auth.roleRequired("admin"), (ctx) => {
    let text = "User: \n";
    db.getUsersWithRoles().forEach((row) => {
        text += row.user_name + " - Rollen: " + row.roles + "\n";
    });
    ctx.reply(text);
});

/** COMMAND | token */
bot.command('token', Auth.roleRequired("user"), Location.User, (ctx) => {
    const tokens = db.getTokens(ctx.from.id);
    if (tokens === undefined) {
        ctx.reply("Du hast noch keinen API Token", {reply_markup: regenerateTokenKeyboard});
    } else {
        let text = "Deine Tokens sind";
        tokens.forEach((v) => {
            text += "\n<code>" + v.token_text + "</code>";
        });
        ctx.reply(text, {parse_mode: "HTML", reply_markup: regenerateTokenKeyboard});
    }
});

bot.on("callback_query", Location.User,ctx => {
    db.removeAllTokens(ctx.from.id);
    const token = db.insertToken(ctx.from.id);
    ctx.editMessageText("Dein neuer Token ist\n<code>"+token+"</code>",{parse_mode:"HTML",reply_markup:regenerateTokenKeyboard});
});

/** COMMAND | top */
bot.command('top', (ctx) => {
    let rows = db.getTopPoints(10);
    let list = "Top Punkte:\n";
    rows.forEach(v => {
        list += "<code>" + levelmanager.getLevel(v.user_points) + "</code> <b>" + levelmanager.getTitel(levelmanager.getLevel(v.user_points)) + "</b> <a href=\"tg://user?id=" + v.id + "\">" + v.user_name + "</a> (" + v.user_points + "/" + levelmanager.getPointGoal(levelmanager.getLevel(v.user_points)) + ")\n";
    });
    ctx.reply(list, {parse_mode: "HTML"})
});

/** COMMAND | ehre */
bot.command('ehre', (ctx) => {
    let rows = db.getTopKarma(10);
    let list = "Top Ehre:\n";
    rows.forEach(v => {
        list += "<code>" + v.user_karma + " Ehre</code> - <a href=\"tg://user?id=" + v.user_id + "\">" + v.user_name + "</a>\n";
    });
    ctx.reply(list, {parse_mode: "HTML"})
});

/** COMMAND | stats */
bot.command('stats', (ctx) => {
    const row = db.getUserWithRoles();
    ctx.reply(row.user_name + "\nPunkte: " + row.user_points + "\nEhre: " + row.user_karma + "\nRollen: " + row.roles);
});

/** FEATURE | Punkte für Nachrichten*/
bot.use((ctx, next) => {
    const user = db.getUser(ctx.from.id);
    if (user !== undefined) {
        if (userMemMap[user.user_id] === undefined) {
            const epoch = new Date(0);
            userMemMap[user.user_id] = {lastUp: epoch, lastDown: epoch, lastSuper: epoch, lastReward: epoch}
        }
        if (ctx.chat !== undefined) {
            if (utils.isGroupChat(ctx.chat.type)) {
                let now = new Date();
                if (now.getTime() - userMemMap[user.user_id].lastReward.getTime() > 180000) { //3 Minuten
                    userMemMap[user.user_id].lastReward = now;

                    const previous = user.user_points;
                    db.addPoints(user.user_id, Math.floor(Math.random() * 12) + 1);
                    checkLevelUp(ctx, ctx.from.id, previous);
                }
            }
        }
    }
    next();
});

/** FEATURE | Super Ehren */
bot.hears(/^(\u2764\ufe0f|\ud83d\udc96|\ud83e\udde1|\ud83d\udc9b|\ud83d\udc9a|\ud83d\udc99|\ud83d\udc9c|\ud83d\udda4).*|.*(\u2764\ufe0f|\ud83d\udc96|\ud83e\udde1|\ud83d\udc9b|\ud83d\udc9a|\ud83d\udc99|\ud83d\udc9c|\ud83d\udda4)$/, (ctx, next) => {
    if (utils.isReply(ctx) && utils.isGroupChat(ctx.chat.type)) {
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

/** FEATURE | Ehren */
bot.hears(/^(\u002b|\u261d|\ud83d\udc46|\ud83d\udc4f|\ud83d\ude18|\ud83d\ude0d|\ud83d\udc4c|\ud83d\udc4d|\ud83d\ude38).*|.*(\u002b|\u261d|\ud83d\udc46|\ud83d\udc4f|\ud83d\ude18|\ud83d\ude0d|\ud83d\udc4c|\ud83d\udc4d|\ud83d\ude38)$/, (ctx, next) => {
    if (utils.isReply(ctx) && utils.isGroupChat(ctx.chat.type)) {
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
});

/** FEATURE | Entehren */
bot.hears(/^(\u2639\ufe0f|\ud83d\ude20|\ud83d\ude21|\ud83e\udd2c|\ud83e\udd2e|\ud83d\udca9|\ud83d\ude3e|\ud83d\udc4e|\ud83d\udc47).*|.*(\u2639\ufe0f|\ud83d\ude20|\ud83d\ude21|\ud83e\udd2c|\ud83e\udd2e|\ud83d\udca9|\ud83d\ude3e|\ud83d\udc4e|\ud83d\udc47)$/, (ctx, next) => {
    if (utils.isReply(ctx) && utils.isGroupChat(ctx.chat.type)) {
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
});

/** FEATURE | JustThings Bildgenerator */
bot.hears(/^((wenn)|(when)) /i, (ctx) => {
    //if (utils.isGroup(ctx.chat.type)){
    justThings.generateImage(ctx.message.text, ctx.from.first_name);
    ctx.replyWithPhoto({source: "resources/wip.jpg"});
});

bot.launch().then(() => console.log("Bot gestartet"));

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

const regenerateTokenKeyboard = Markup.inlineKeyboard([
    Markup.callbackButton('Regenerate Token', 'regenerateToken')
])

class InlineQueryResultArticle {
    constructor(id, title, description, content, parse_mode) {
        this.type = "article";
        this.id = id;
        this.title = title;
        this.input_message_content = {message_text: content, parse_mode: parse_mode};
        this.description = description;
    }
}