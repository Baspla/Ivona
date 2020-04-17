db = require("../../../data/db.js");

exports.roleRequired = (...roles) => {
    return (ctx, next) => {
        for (let i = 0; i < roles.length; i++) {
            console.log(db.getUserByTGID(ctx.from.id).name," braucht ",roles[i])
            if (db.hasUserRole(db.getUserByTGID(ctx.from.id).id, roles[i]))
                return next();
        }
        ctx.reply("Du hast keine Berechtigung dazu.");
    }
};