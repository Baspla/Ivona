import { Context } from "telegraf"
import { AsyncPredicate } from "telegraf/typings/composer"
import { Update } from "telegraf/typings/core/types/typegram"
import { addUserToGroup } from "../../data/data"

export const UserIsInGroup:AsyncPredicate<Context<Update>> = (ctx)=>{
    return addUserToGroup(ctx.from.id, ctx.chat.id)
    .then((v) => {
        if (v > 0)
            console.debug("Nutzer " + ctx.from.id + " wurde der Gruppe " + ctx.chat.id + " hinzugefügt");
        return true;
    },(err) => {
        console.error("Nutzer konnte Gruppe nicht hinzugefügt werden: " + err);
        return false;
    })
}