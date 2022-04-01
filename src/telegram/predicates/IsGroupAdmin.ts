import { Context } from "telegraf"
import { AsyncPredicate } from "telegraf/typings/composer"
import { Update } from "telegraf/typings/core/types/typegram"

export const IsGroupAdmin:AsyncPredicate<Context<Update>> = (ctx)=>{
    return ctx.getChatAdministrators().then((admins)=>{
        let user_status = admins.find((member,index,list)=>{return (member.user.id==ctx.from.id)}).status;
        return (user_status=="creator"||user_status=="administrator")
    })
}