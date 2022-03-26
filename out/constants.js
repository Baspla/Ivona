"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.titles = exports.levels = exports.transaction = exports.logs = exports.settings = exports.permissions = exports.boolean = exports.currency = void 0;
exports.currency = { symbol: "$" };
exports.boolean = { true: "true" };
exports.permissions = {
    system: { restart: "system.restart", reload: "system.reload", ip: "system.ip" },
    database: { backup: "database.backup" },
    discord: { quote: "discord.quote" },
};
exports.settings = {
    types: { user: "user", group: "group" },
    features: {
        points: "features.points", magic: "features.magic", justThings: "features.justThings",
        anime: "features.anime", karma: "features.karma", steam: "features.steam",
        magicDaily: "features.magicDaily", haiku: "features.haiku"
    }
};
exports.logs = { db: "[Database]" };
exports.transaction = { reward: "reward" };
exports.levels = [
    100, 350, 800, 1000, 1400,
    1900, 2200, 2500, 3000, 3500,
    4000, 4500, 5000, 5500, 6000,
    6500, 7000, 8000, 10000, 15000, 20000
];
exports.titles = [
    "Chat-Leiche",
    "Rentner",
    "Rekrut",
    "Frischling",
    "Freischwimmer",
    "Woke Chatter",
    "Plappermaul",
    "Informant",
    "Kurznachrichten Goethe",
    "T9-Profi",
    "Message Meister",
    "Bot-Jünger",
    "Yeet-aholic",
    "Flachwitzler",
    "Captain",
    "Cleverbot",
    "Commander",
    "Legende",
    "Chat-Süchtiger",
    "Meme-Lord",
    "Chat-Gott"
];
//# sourceMappingURL=constants.js.map