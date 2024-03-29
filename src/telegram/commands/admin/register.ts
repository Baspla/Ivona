import { Composer, deunionize } from "telegraf";
import { userFlags } from "../../../constants/userFlags";
import { createGroup, groupExists, hasUserFlag } from "../../../data/data";
import { hasUserFlags } from "../../predicates/HasUserFlags";
import { errorHandler } from "../../utils/utils";

export const registerCommand = Composer.optional(hasUserFlags(userFlags.admin.registerGroup),Composer.command("register", (ctx) => {
        groupExists(ctx.chat.id).then((val) => {
            if (val == 0) {
                createGroup(ctx.chat.id, deunionize(ctx.chat).title).then((val2) => {
                    if (val2 != 0){
                        ctx.reply("Gruppe registriert");
                        console.log("Gruppe registriert ("+ctx.chat.id+ ", "+deunionize(ctx.chat).title+")")
                }else
                        ctx.reply("Gruppe konnte nicht registriert werden")
                },errorHandler)
            } else ctx.reply("Diese Gruppe ist schon registriert.")
        },errorHandler)
    }))