import { Context, deunionize } from "telegraf"
import { Predicate } from "telegraf/typings/composer"
import { Update } from "telegraf/typings/core/types/typegram"
import utils from "../utils/utils";

export const IsOwner:Predicate<Context<Update>> = (ctx)=>{
    return utils.isCreator(ctx.from.id);
}