db = require("../../../data/db.js");

exports.roleRequired = (...roles) => {
    return (ctx, next) => {
        for (let i = 0; i < roles.length; i++) {
            if (db.hasUserRole(ctx.from.id, roles[i]))
                return next();
        }
        ctx.reply("Du hast keine Berechtigung dazu.");
    }
};