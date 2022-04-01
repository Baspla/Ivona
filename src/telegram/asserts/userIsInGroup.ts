import { Composer } from "telegraf";
import { registeredGroup } from "../hubs/registeredGroup";
import { UserExists } from "../predicates/UserExists";
import { UserIsInGroup } from "../predicates/UserIsInGroup";

export const userIsInGroup = Composer.optional(UserIsInGroup,registeredGroup)