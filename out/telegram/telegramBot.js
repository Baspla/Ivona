"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const telegraf_1 = require("telegraf");
const config = __importStar(require("../config.js"));
const perf_hooks_1 = require("perf_hooks");
const utils_js_1 = __importDefault(require("./utils/utils.js"));
const debug_1 = require("./commands/utility/debug");
const start_1 = require("./commands/start");
const version_1 = require("./commands/utility/version");
const help_1 = require("./commands/help");
const restart_1 = require("./commands/utility/restart");
const vote_1 = require("./listeners/points/vote");
const data_1 = require("../data/data");
const ehre_js_1 = require("./commands/points/ehre.js");
const bot = new telegraf_1.Telegraf(config.telegram.token);
/**
 * Zeichnet die Performanz einer Anfrage auf
 */
bot.use((ctx, next) => {
    console.log(ctx);
    let start = perf_hooks_1.performance.now();
    let r = next();
    console.info("Die Anfrage hat ", (perf_hooks_1.performance.now() - start).toFixed(3), " Millisekunden zum Bearbeiten gebraucht.");
    return r;
});
(0, version_1.setupVersion)(bot);
/**
 * Erstellt einen Nutzer, falls dieser noch nicht existert
 */
bot.use((ctx, next) => {
    if (ctx.from !== undefined) {
        (0, data_1.createUser)(ctx.from.id, ctx.from.first_name, ctx.from.last_name, ctx.from.username, ctx.from.first_name)
            .then((v) => {
            if (v > 0)
                console.debug("Nutzer " + ctx.from.id + " wurde erstellt");
            next();
        }).catch((err) => {
            ctx.reply("Fehler. Bitte melde dich bei @TimMorgner");
            console.error("Nutzer konnte nicht erstellt werden: " + err);
        });
    }
    else {
        console.warn("Nachricht ohne \"from\": " + ctx);
    }
});
//	setupClaim(bot);
//	setupRegister(bot);
(0, start_1.setupStart)(bot);
/**
 * Fügt Nutzer zur Gruppe hinzu, falls diese noch nicht existert
 */
bot.use((ctx, next) => {
    if (ctx.chat == null) {
        return next();
    }
    if (utils_js_1.default.isGroupChat(ctx.chat.type)) {
        (0, data_1.groupExists)(ctx.chat.id).then((int) => {
            if (int == 1) {
                (0, data_1.addUserToGroup)(ctx.from.id, ctx.chat.id)
                    .then((v) => {
                    if (v > 0)
                        console.debug("Nutzer " + ctx.from.id + " wurde der Gruppe " + ctx.chat.id + " hinzugefügt");
                    next();
                }).catch((err) => {
                    console.error("Nutzer konnte Gruppe nicht hinzugefügt werden: " + err);
                });
            }
        });
        return;
    }
    return next();
});
//setupReload(bot);
(0, restart_1.setupRestart)(bot);
//setupBackup(bot);
(0, debug_1.setupDebug)(bot);
//setupMc(bot);
//setupAnime(bot);
//setupMagic(bot);
//setupRandomCard(bot);
(0, help_1.setupHelp)(bot);
//setupTop(bot);
(0, ehre_js_1.setupEhre)(bot);
//setupStats(bot);
//setupHaiku(bot);
//setupPoints(bot);
(0, vote_1.setupVote)(bot);
//setupJustThings(bot);
//schedule.scheduleJob("*/30 * * * *", function () {
//	if (0 === Math.floor(Math.random() * Math.floor(11)))
//		steamTest(bot);
//});
//schedule.scheduleJob("0 9 * * *", function () {
//	dailyCard(bot);
//});
//schedule.scheduleJob("0 */1 * * *", function () {
//});
bot.launch().then(() => console.info("Bot gestartet"));
//# sourceMappingURL=telegramBot.js.map