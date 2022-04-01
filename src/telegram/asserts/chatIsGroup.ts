import { Composer } from "telegraf";
import { registerCommand } from "../commands/admin/register";
import { ChatIsGroup } from "../predicates/ChatIsGroup";
import { groupIsRegistered } from "./groupIsRegistered";

export const chatIsGroup = Composer.optional(ChatIsGroup,registerCommand,groupIsRegistered)