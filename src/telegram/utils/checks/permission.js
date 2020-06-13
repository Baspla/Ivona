const db = require("../../../data/db");
exports.hasPermission = (permissionName) => {
	return (ctx, next) => {
		if (db.hasPermissionByTGID(ctx.from.id,permissionName))
			return next();
		else
			ctx.reply("Du hast keine Berechtigung dazu.");
	};
};