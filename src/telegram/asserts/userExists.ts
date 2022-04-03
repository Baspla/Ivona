import { Composer } from "telegraf";
import { admin } from "../hubs/admin";
import { UserExists } from "../predicates/UserExists";
import { chatIsGroup } from "./chatIsGroup";
import { isOwner } from "./isOwner";

export const userExists = Composer.optional(UserExists,isOwner,admin,chatIsGroup)