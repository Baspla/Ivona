import { Context } from "telegraf"
import { AsyncPredicate } from "telegraf/typings/composer"
import { Update } from "telegraf/typings/core/types/typegram"
import { getUserFlags } from "../../data/data"

export function hasUserFlags(...required_flags: string[]): AsyncPredicate<Context<Update>> {
    return async (ctx) => {
        const user_flags = await getUserFlags(ctx.from.id)
        return (required_flags.every((val) => user_flags.includes(val)))
    }
}
