export const ssl = {passphrase:process.env.SSL_PASSPHRASE};
export const web = {sessionSecret:process.env.SESSION_SECRET,ports:{http:process.env.HTTP_PORT,https:process.env.HTTPS_PORT}};
export const minecraft = {ip:"46.228.198.93",port:25565};
export const steam = {id: process.env.STEAM_ID, key: process.env.STEAM_KEY};
export const chatReward = 2;
export const telegram = {token:process.env.BOT_TOKEN};
export const cooldown = {reward: 3000, voteSuper: 120000,voteUp:5000,voteDown:10000};