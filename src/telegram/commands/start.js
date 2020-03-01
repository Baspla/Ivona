exports.setupStart = setupStart;

function setupStart(bot) {
    bot.start((ctx) => ctx.replyWithPhoto({source: 'resources/profile.jpg'}, {caption: "Hi, Ich bin Ivona.\nIch bin hier um dir zu Helfen."}));
}