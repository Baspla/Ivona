import { Composer } from "telegraf";
import { GroupIsRergistered } from "../predicates/GroupIsRegistered";
import { UserExists } from "../predicates/UserExists";
import { userIsInGroup } from "./userIsInGroup";

export const groupIsRegistered = Composer.optional(GroupIsRergistered,userIsInGroup)