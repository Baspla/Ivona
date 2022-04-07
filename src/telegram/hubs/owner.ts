import { Composer } from "telegraf";
import { claimCommand } from "../commands/admin/claim";
import { varCommand } from "../commands/admin/var";
export const owner = Composer.compose([
    claimCommand,
    varCommand
]);