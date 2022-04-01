import { Context } from "telegraf"
import { AsyncPredicate } from "telegraf/typings/composer"
import { Update } from "telegraf/typings/core/types/typegram"
import { createUser } from "../../data/data"

export const UserExists:AsyncPredicate<Context<Update>> = (ctx)=>{
        return createUser(ctx.from.id, ctx.from.first_name, ctx.from.last_name, ctx.from.username, ctx.from.first_name,)
            .then((v) => {
                if (v > 0)
                    console.debug("Nutzer " + ctx.from.id + " wurde erstellt");
                return true;
            },(err) => {
                ctx.reply("Fehler. Bitte melde dich bei @TimMorgner");
                console.error("Nutzer konnte nicht erstellt werden: " + err);
                return false;
            })
}
