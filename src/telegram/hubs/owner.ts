import { Composer } from "telegraf";
import { claimCommand } from "../commands/admin/claim";
export const owner = Composer.compose([
    claimCommand
]);