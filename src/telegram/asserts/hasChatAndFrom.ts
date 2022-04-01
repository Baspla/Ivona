import { Composer } from "telegraf";
import { HasFromAndChat } from "../predicates/HasFromAndChat";
import { userExists } from "./userExists";

export const hasChatAndFrom = Composer.optional(HasFromAndChat,userExists)