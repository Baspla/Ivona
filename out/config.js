"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cooldown = exports.telegram = exports.chatReward = exports.steam = exports.minecraft = exports.web = exports.ssl = void 0;
exports.ssl = { passphrase: process.env.SSL_PASSPHRASE };
exports.web = { sessionSecret: process.env.SESSION_SECRET, ports: { http: process.env.HTTP_PORT, https: process.env.HTTPS_PORT } };
exports.minecraft = { ip: "46.228.198.93", port: 25565 };
exports.steam = { id: process.env.STEAM_ID, key: process.env.STEAM_KEY };
exports.chatReward = 2;
exports.telegram = { token: process.env.BOT_TOKEN };
exports.cooldown = { reward: 3000, voteSuper: 120000, voteUp: 5000, voteDown: 10000 };
//# sourceMappingURL=config.js.map