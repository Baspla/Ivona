exports.minimumArgs = (min) => {
	return (ctx, next) => {
		if (ctx.args !== undefined) {
			if (ctx.args.length >= min) {
				next();
			} else {
				if(min === 1){
					ctx.reply("Dieser Befehl benötigt mindestens "+min+" Argument.");
				}else
					ctx.reply("Dieser Befehl benötigt mindestens "+min+" Argumente.");
			}
		} else next();
	};
};
