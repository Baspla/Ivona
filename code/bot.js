const sqlite3 = require('sqlite3').verbose(); //https://github.com/mapbox/node-sqlite3/wiki/API#databasepreparesql-param--callback
const db = new sqlite3.Database('./my.db');
const Telegraf = require('telegraf'); //https://telegraf.js.org/#/?id=sendmessage
//const TelegrafI18n = require('telegraf-i18n') //https://github.com/telegraf/telegraf-i18n
const bot = new Telegraf(process.env.BOT_TOKEN);
const shell = require('shelljs');
const anime = require("./anime");
const utils = require("./utils");
const querys = require("./querys");
const levelmanager = require("./levels");
const justThings = require("./justThings");

let userMemMap = {};



//Erstellt Tabellen, falls nicht vorhanden

db.serialize(function () {
    db.run("CREATE TABLE IF NOT EXISTS award (id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT UNIQUE,title TEXT NOT NULL,description INTEGER NOT NULL)");
    db.run("CREATE TABLE IF NOT EXISTS user (id INTEGER NOT NULL PRIMARY KEY UNIQUE,username INTEGER NOT NULL UNIQUE,points INTEGER DEFAULT 0,karma REAL DEFAULT 0)");
    db.run("CREATE TABLE IF NOT EXISTS code (id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT UNIQUE,code TEXT NOT NULL UNIQUE,description TEXT NOT NULL)");
    /*db.each("SELECT * FROM user", function (err, row) {
        console.log(row.id + ": " + row.username);
    });*/ //Gibt alle Nutzer mit ID aus
});

process.on('SIGINT', () => {
    db.close();
    process.exit(0);
});

// User wird erstellt, falls nicht vorhanden
bot.use((ctx, next) => {
    db.get(querys.getUser, ctx.from.id, (err, row) => {
        if (err) {
            throw err;
        }
        if (row === undefined && !ctx.from.is_bot) {
            console.log("Nutzer erstellt");
            db.run(querys.addUser, ctx.from.id, ctx.from.first_name, 0, 0);
        }
        next();
    });
});

/** /start Befehl */
bot.start((ctx) => ctx.replyWithPhoto({source: 'resources/profile.jpg'}, {caption: "Hi, Ich bin Ivona.\nIch bin hier um dir zu Helfen."}));

/** /help Befehl */
bot.help((ctx) => ctx.reply('Hilfe'));

/** Kevins Anime Suche */
anime.command(bot);

/** Punkte Scoreboard Befehl */
bot.command('top', (ctx) => {
    db.all(querys.listTopPoints, 10, (err, rows) => {
        if (err) {
            throw err;
        }
        var list = "Top Punkte:\n";
        rows.forEach(v => {
            list += "<code>" + levelmanager.getLevel(v.points) + "</code> <b>" + levelmanager.getTitel(levelmanager.getLevel(v.points)) + "</b> <a href=\"tg://user?id=" + v.id + "\">" + v.username + "</a> (" + v.points + "/" + levelmanager.getPointGoal(levelmanager.getLevel(v.points)) + ")\n";
        });
        ctx.reply(list, {parse_mode: "HTML"})
    });
});

bot.command('restart',(ctx)=>{
    if(utils.isCreator(ctx.from.id)){
        ctx.reply("Starte neu...")
        shell.exec('../restart.sh');
    }else{
        ctx.reply("Du hast keine Berechtigung dazu.");
    }
})
/** Karma Scoreboard Befehl */
bot.command('ehre', (ctx) => {
    db.all(query.listTopKarma, 10, (err, rows) => {
        if (err) {
            throw err;
        }
        var list = "Top Ehre:\n";
        rows.forEach(v => {
            list += "<code>" + v.karma + " Ehre</code> - <a href=\"tg://user?id=" + v.id + "\">" + v.username + "</a>\n";
        });
        ctx.reply(list, {parse_mode: "HTML"})
    });
});

/** Debug Punkte + Befehl */
bot.command('cheat', (ctx) => {
    db.get(querys.getUser, ctx.from.id, (err, row) => {
        if (err) {
            throw err;
        }
        if (row !== undefined) {
            ctx.reply("Füge 100 Punkte hinzu.")
            addPoints(ctx, row, 100);
        }
    });
});

/** Befehl zum Anzeigen der Statistik eines Nutzers */
bot.command('stats', (ctx) => {
    ctx.reply('ToDo Stats')
});

/** JustThings Bildgenerator */
bot.hears(/^((wenn)|(when)) /i, (ctx) => {
    //if (utils.isGroup(ctx.chat.type)){
        justThings.generateImage(ctx.message.text,ctx.from.first_name);
        ctx.replyWithPhoto({source:"resources/temp/justThings.png"});
});

bot.launch();

bot.use((ctx, next) => {
    db.get(querys.getUser, ctx.from.id, (err, row) => {
        if (err) {
            throw err;
        }
        if (row !== undefined) {
            var user = row;
            if (user !== undefined) {
                if (userMemMap[user.id] === undefined) {
                    epoch = new Date(0);
                    userMemMap[user.id] = {lastUp: epoch, lastDown: epoch, lastSuper: epoch, lastReward: epoch}
                }
                if (utils.isGroup(ctx.chat.type)) {
                    let now = new Date();
                    if (now.getTime() - userMemMap[user.id].lastReward.getTime() > 180000) { //3 Minuten
                        userMemMap[user.id].lastReward = now;
                        addPoints(ctx, user, Math.floor(Math.random() * 12) + 1);
                    }
                }
            }
        }
        next();
    });
});


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
//TEST
function addPoints(ctx, user, points) {
    db.run(querys.increasePoints, points, user.id);
    checkLevelUp(ctx, user, user.points);
}