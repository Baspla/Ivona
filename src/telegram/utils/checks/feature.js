const utils = require("../utils");
const db = require("../../../data/db.js");

exports.hasFeature = (featureId) => {
    return (ctx, next) => {
        if (ctx.chat !== undefined) {
            if (utils.isGroupChat(ctx.chat.type)) {
                const group = db.getGroupByTGID(ctx.chat.id);
                if (group !== undefined) {
                    if (db.hasGroupFeature(group.id, featureId))
                        return next();
                }
            } else {
                return next()
            }
        } else {
            return next()
        }
    }
};