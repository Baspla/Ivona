import { Composer } from "telegraf";
import { UserExists } from "../predicates/UserExists";
import { chatIsGroup } from "./chatIsGroup";
import { isOwner } from "./isOwner";

export const userExists = Composer.optional(UserExists,isOwner,chatIsGroup)