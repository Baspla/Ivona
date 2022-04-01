import { Context, deunionize } from "telegraf"
import { Predicate } from "telegraf/typings/composer"
import { Update } from "telegraf/typings/core/types/typegram"

export const IsReply:Predicate<Context<Update>> = (ctx)=>{
    let m = deunionize(ctx.message);
    if (m.reply_to_message !== undefined) {
        return m.reply_to_message.from !== undefined;
    }
    return false;
}