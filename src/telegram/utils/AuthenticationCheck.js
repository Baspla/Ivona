db = require("../../data/db.js");

exports.roleRequired = (role) => {
    return (ctx, next) => {
        if (db.hasUserRole(ctx.from.id, role)) {
            next();
        } else {
            ctx.reply("Du hast keine Berechtigung dazu.");
        }
    }
};