import { Context } from "telegraf"
import { Predicate } from "telegraf/typings/composer"
import { Update } from "telegraf/typings/core/types/typegram"

export const HasFromAndChat:Predicate<Context<Update>> = (ctx)=>{
    return ctx.from!=undefined && ctx.chat != undefined
}