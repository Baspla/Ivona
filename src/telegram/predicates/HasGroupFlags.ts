import { Context } from "telegraf"
import { AsyncPredicate } from "telegraf/typings/composer"
import { Update } from "telegraf/typings/core/types/typegram"
import { createUser, getGroupFlags } from "../../data/data"

export function hasGroupFlags(...required_flags: string[]): AsyncPredicate<Context<Update>> {
    return async (ctx) => {
        const group_flags = await getGroupFlags(ctx.chat.id)
        return (required_flags.every((val) => group_flags.includes(val)))
    }
}
