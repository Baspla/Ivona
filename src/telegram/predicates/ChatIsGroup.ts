import { Context } from "telegraf"
import { Predicate } from "telegraf/typings/composer"
import { Update } from "telegraf/typings/core/types/typegram"

export const ChatIsGroup:Predicate<Context<Update>> = (ctx)=>{
    return ctx.chat.type=="group"||ctx.chat.type=="supergroup";
}