module.exports.web = {sessionSecret:process.env.SESSION_SECRET};
module.exports.minecraft = {ip:"46.228.198.93",port:25565};
module.exports.steam = {id: process.env.STEAM_ID, key: process.env.STEAM_KEY};
module.exports.chatReward = 2;
module.exports.dyndns = {url:process.env.DYNDNS_URL};
module.exports.telegram = {token:process.env.BOT_TOKEN};
module.exports.cooldown = {reward: 180000, voteSuper: 7200000,voteUp:300000,voteDown:600000};