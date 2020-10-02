module.exports.ssl = {passphrase:process.env.SSL_PASSPHRASE};
module.exports.web = {sessionSecret:process.env.SESSION_SECRET,ports:{http:process.env.HTTP_PORT,https:process.env.HTTPS_PORT}};
module.exports.minecraft = {ip:"46.228.198.93",port:25565};
module.exports.steam = {id: process.env.STEAM_ID, key: process.env.STEAM_KEY};
module.exports.chatReward = 2;
module.exports.telegram = {token:process.env.BOT_TOKEN};
module.exports.cooldown = {reward: 180000, voteSuper: 7200000,voteUp:300000,voteDown:600000};