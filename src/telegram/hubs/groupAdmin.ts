import { Composer } from "telegraf";
import { featureCommand } from "../commands/admin/feature";
import { IsGroupAdmin } from "../predicates/IsGroupAdmin";

export const groupAdmin = Composer.optional(IsGroupAdmin,featureCommand);