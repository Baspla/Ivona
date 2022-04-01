import { Composer, deunionize } from "telegraf";
import { userFlags } from "../../../constants/userFlags";
import { createGroup, groupExists, hasUserFlag } from "../../../data/data";
import { hasUserFlags } from "../../predicates/HasUserFlags";

export const registerCommand = Composer.optional(hasUserFlags(userFlags.admin.registerGroup),Composer.command("register", (ctx) => {
        groupExists(ctx.chat.id).then((val) => {
            if (val == 0) {
                createGroup(ctx.chat.id, deunionize(ctx.chat).title).then((val2) => {
                    if (val2 != 0)
                        ctx.reply("Gruppe registriert");
                    else
                        ctx.reply("Gruppe konnte nicht registriert werden")
                })
            } else ctx.reply("Diese Gruppe ist schon registriert.")
        })
    }))