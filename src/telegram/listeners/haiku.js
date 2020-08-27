const db = require("../../data/db");
const utils = require("../utils/utils");
const GroupSetting = require("../utils/checks/groupsetting");
const constants = require("../../constants");
const syllable = require("syllable");
exports.setupHaiku = setupHaiku;

function setupHaiku(bot) {
	console.debug("Init Haiku");
	bot.on("text", (ctx, next) => {
		console.debug("Process Haiku - 1");
		if (ctx.chat !== undefined) {
			console.debug("Process Haiku - 2");
			if (utils.isGroupChat(ctx.chat.type)) {
				console.debug("Process Haiku - 3");
				if (!GroupSetting.isEnabled(constants.settings.features.haiku)) return next();
				console.debug("Process Haiku - 4");
				const ug = db.getUserGroupByTGID(ctx.from.id, ctx.chat.id);
				if (ug != null) {
					console.debug("Process Haiku - 5");
					let text = ctx.message.text;
					console.debug("text: "+text);
					console.debug("len:"+text.length);
					let textSplitted = text.split(" ");
					let lines = ["", "", ""];
					let counter = 0;
					let iteration = 0;
					for(let i = 0; i < textSplitted.length; i++){
						console.debug("c: "+counter+", i: "+iteration);
						if(iteration > 2){
							console.debug("return 1 - c: "+counter+", i: "+iteration);
							return;
						}
						console.debug("syllableing: "+textSplitted[i]);
						console.debug("has: "+syllable(textSplitted[i]));
						counter += syllable(textSplitted[i]);
						if(iteration === 0 || iteration === 2){
							if(counter > 5){
								console.debug("return 2 - c: "+counter+", i: "+iteration);
								return;
							}
						}
						else if(iteration === 1){
							if(counter > 7){
								console.debug("return 3 - c: "+counter+", i: "+iteration);
								return;
							}
						}
						lines[iteration] += textSplitted[i] + " ";
						if(((iteration === 0 || iteration === 2) && counter === 5) || (iteration === 1 && counter === 7)){
							iteration++;
							counter = 0;
						}
					}
					console.debug("Counter: "+counter);
					if(counter !== 0){
						console.debug("return 4 - c: "+counter+", i: "+iteration);
						return;
					}
					console.debug("Process Haiku - 6");
					ctx.reply(lines[0].trim() + "\n" + lines[1].trim() + "\n" + lines[2].trim() + "\n- " + ug.user.name);
				}
			}
		}
		next();
	});
}