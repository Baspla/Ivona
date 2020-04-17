const db = require("../../data/db");
const Command = require("../utils/checks/arguments");
const Auth = require("../utils/checks/authentication");
const Location = require("../utils/checks/location");
const roles = require("../utils/roles");

exports.setupFeature = setupFeature;

function setupFeature(bot) {
    bot.command('feature', Location.Group, Auth.roleRequired(roles.admin), Command.minimumArgs(1), (ctx) => {
        const group = db.getGroupByTGID(ctx.chat.id);
        if (group !== undefined) {
            const feature = db.getFeatureByName(ctx.args[0]);
            console.log(feature)
            if (feature !== undefined) {
                if (db.hasGroupFeature(group.id, feature.id)) {
                    try {
                        db.removeGroupFeature(group.id, feature.id);
                        ctx.reply("Feature "+feature.name+" entfernt.");
                    } catch (e) {
                        ctx.reply("Fehler: " + e);
                    }
                } else {
                    try {
                        db.addGroupFeature(group.id, feature.id);
                        ctx.reply("Feature "+feature.name+" hinzugefügt.");
                    } catch (e) {
                        ctx.reply("Fehler: " + e);
                    }
                }
            }else{ctx.reply("Unbekanntes Feature")}
        }else{ctx.reply("Unbekannte Gruppe")}
    });
}