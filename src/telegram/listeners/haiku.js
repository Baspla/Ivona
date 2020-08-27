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
					let textSplitted = text.split(" ");
					let lines = ["", "", ""];
					let counter = 0;
					let iteration = 0;
					for(let i = 0; i < textSplitted.length; i++){
						if(iteration > 2)
							return;
						counter += syllable(textSplitted[i]);
						if(iteration === 0 || iteration === 2){
							if(counter > 5)
								return;
						}
						else if(iteration === 1){
							if(counter > 7)
								return;
						}
						lines[iteration] += textSplitted[i] + " ";
						if(((iteration === 0 || iteration === 2) && counter === 5) || (iteration === 1 && counter === 7)){
							iteration++;
							counter = 0;
						}
					}
					if(counter !== 0)
						return;
					console.debug("Process Haiku - 6");
					ctx.reply(lines[0].trim() + "\n" + lines[1].trim() + "\n" + lines[2].trim() + "\n- " + ug.user.name);
				}
			}
		}
		next();
	});
}