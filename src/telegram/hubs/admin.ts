import { Composer } from "telegraf";
import { userFlags } from "../../constants/userFlags";
import { featureCommand } from "../commands/admin/feature";
import { debugCommand } from "../commands/utility/debug";
import { hasUserFlags } from "../predicates/HasUserFlags";
import { IsGroupAdmin } from "../predicates/IsGroupAdmin";

export const admin = debugCommand;