import { Context } from "telegraf"
import { AsyncPredicate } from "telegraf/typings/composer"
import { Update } from "telegraf/typings/core/types/typegram"
import { groupExists } from "../../data/data"

export const GroupIsRergistered:AsyncPredicate<Context<Update>> = (ctx)=>{
    return groupExists(ctx.chat.id).then((int) => int == 1)
}