module.exports = {getLevel,getTitel,getPointGoal};
const levels = [
    100, 350, 800, 1000, 1400,
    1900, 2200, 2500, 3000, 3500,
    4000, 4500, 5000, 5500, 6000,
    6500, 7000, 8000, 10000, 15000, 20000];
const titles = [
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

function getLevel(points) {
    for (var i = 0; i < levels.length; i++) {
        if (points < levels[i]) return i;
    }
    return levels.length - 1;
}

function getPointGoal(level) {
    if (level < 0)
        level = 0;
    if (level >= levels.length)
        return "∞";
    return levels[level];
}

function getTitel(level) {
    if (level < 0)
        level = 0;
    if (level >= titles.length)
        level = titles.length;
    if (titles.length === 0) return "Keine Titel";
    return titles[level];
}