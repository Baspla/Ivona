const db = require("../../data/db");
const Command = require("../utils/checks/arguments");
const Auth = require("../utils/checks/authentication");
const Location = require("../utils/checks/location");
const roles = require("../utils/roles");

exports.setupFeatures = setupFeatures;

function setupFeatures(bot) {
    bot.command('features', Location.Group, Auth.roleRequired(roles.admin), (ctx) => {
            const group = db.getGroupByTGID(ctx.chat.id);
            if (group !== undefined) {
                let txt = "Features\n\n";
                db.getFeatures().forEach((f) => {
                    txt += f.name + " " + ((db.hasGroupFeature(group.id,f.id)) ? "✔" : "❌")+"\n";
                });
                ctx.reply(txt);
            } else {
                ctx.reply("Unbekannte Gruppe")
            }
        }
    );
}