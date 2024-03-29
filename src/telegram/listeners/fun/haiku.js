import * as syllable from "syllable";

import db from '../../../data/db.js';
import utils from '../../utils/utils.js';
import * as GroupSetting from '../../utils/checks/groupsetting.js';
import * as constants from '../../../constants.js';
export { setupHaiku };

function setupHaiku(bot) {
	bot.on("text", (ctx, next) => {
		if (ctx.chat !== undefined) {
			if (utils.isGroupChat(ctx.chat.type)) {
				if (!GroupSetting.isEnabled(constants.settings.features.haiku)) return next();
				const ug = db.getUserGroupByTGID(ctx.from.id, ctx.chat.id);
				if (ug != null) {
					let text = ctx.message.text.replace(/\n/g, " ");
					let textSplitted = text.split(" ");
					let lines = ["", "", ""];
					let counter = 0;
					let iteration = 0;
					for(let i = 0; i < textSplitted.length; i++){
						if(iteration > 2){
							return next();
						}
						counter += syllable(textSplitted[i]);
						if(iteration === 0 || iteration === 2){
							if(counter > 5){
								return next();
							}
						}
						else if(iteration === 1){
							if(counter > 7){
								return next();
							}
						}
						lines[iteration] += textSplitted[i] + " ";
						if(((iteration === 0 || iteration === 2) && counter === 5) || (iteration === 1 && counter === 7)){
							iteration++;
							counter = 0;
						}
					}
					console.debug("Haiku Debug: "+counter+" - "+iteration);
					if(counter !== 0 || iteration !== 3){
						return next();
					}
					ctx.reply(lines[0].trim() + "\n" + lines[1].trim() + "\n" + lines[2].trim() + "\n- " + ug.user.name);
				}
			}
		}
		next();
	});
}