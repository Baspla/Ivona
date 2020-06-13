module.exports.currency = {symbol:"$"};
module.exports.boolean = {true: "true"};
module.exports.permissions = {
	system:
		{restart: "system.restart", reload: "system.reload", ip: "system.ip"},
	database: {backup: "database.backup"},
	discord: {quote: "discord.quote"},
};
module.exports.settings = {
	types:{user:"user",group:"group"},
	features:
		{
			points: "features.points", magic: "features.magic", justThings: "features.justThings",
			anime: "features.anime", karma: "features.karma", steam: "features.steam",
			magicDaily:"features.magicDaily"
		}
};
module.exports.logs = {db: "[Database]"};
module.exports.transaction = {reward: "reward"};
module.exports.levels = [
	100, 350, 800, 1000, 1400,
	1900, 2200, 2500, 3000, 3500,
	4000, 4500, 5000, 5500, 6000,
	6500, 7000, 8000, 10000, 15000, 20000];
module.exports.titles = [
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