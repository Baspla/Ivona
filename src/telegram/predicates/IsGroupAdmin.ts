import { Context } from "telegraf"
import { AsyncPredicate } from "telegraf/typings/composer"
import { Update } from "telegraf/typings/core/types/typegram"

export const IsGroupAdmin:AsyncPredicate<Context<Update>> = (ctx)=>{
    return ctx.getChatAdministrators().then((admins)=>{
        let user = admins.find((member,index,list)=>{return (member.user.id==ctx.from.id)});
        if(user != undefined)
            return (user.status=="creator"||user.status=="administrator")
        else
            return false;
    },(error)=>{console.error(error);return false})
}