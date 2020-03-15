exports.setupAnimalCrossing = setupAnimalCrossing;

function setupAnimalCrossing(bot) {
  bot.command("ac", (ctx) => {
    var goal = new Date(2020, 2, 20, 0, 0, 0);
    var now = new Date();
    var s = goal - now;
    if(s<0){
      ctx.reply("Animal Crossing New Horizons ist erschienen!");
    }else{
      var ms = s % 1000;
      s = (s - ms) / 1000;
      var secs = s % 60;
      s = (s - secs) / 60;
      var mins = s % 60;
      s = (s - mins) / 60;
      var hrs = s % 24;
      var days = (s - hrs) / 24
      ctx.reply("Noch "+days + " Tage, " + hrs + " Stunden, " + mins + " Minuten und " + secs + " Sekunden.");
    }
  });
}

